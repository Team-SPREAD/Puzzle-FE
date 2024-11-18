import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Controls,
  Connection,
  ReactFlowInstance,
  NodeChange,
  Node,
  applyNodeChanges,
  applyEdgeChanges,
  EdgeChange,
  MarkerType,
  useReactFlow,
  PanOnScrollMode,
  Edge,
} from 'reactflow';

import { toPng } from 'html-to-image';
import { useMutation, useStorage } from '@/liveblocks.config';
import FloatingEdge from './FloatingEdge';
import StakeholderConnectionLine from './StakeholderConnectionLine';

import 'reactflow/dist/style.css';
import './style.css';
import { nanoid } from 'nanoid';
import FloatingArrowLabelEdge from './FloatingArrowLabelEdge';
import InputForNode from './InputForNode';
import MiddleNode from './Node/MiddleNode';

type Viewport = { x: number; y: number; zoom: number };

const StepViewport: Viewport = { x: 0, y: 0, zoom: 1 };

const connectionLineStyle = {
  strokeWidth: 2,
  stroke: 'gray',
};

const nodeTypes = {
  middleNode: MiddleNode,
};

const edgeTypes = {
  floating: FloatingEdge,
  'floating-label-arrow': FloatingArrowLabelEdge,
};

const defaultEdgeOptions = {
  style: { strokeWidth: 1, stroke: 'gray' },
  type: 'floating-label-arrow',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'gray',
  },
  data: {
    endLabel: '가치',
  },
};

const Flow = () => {
  const connectingNodeId = useRef<string | null>(null);
  const nodes = useStorage((root) => root.nodes);
  const edges = useStorage((root) => root.edges);
  const [nodeColor, setNodeColor] = useState('#121417');
  const reactFlow = useReactFlow();

  // reactFlowWrapper는 전체 컴포넌트를 감싸고, reactFlowContainer는 ReactFlow 컴포넌트만을 캡처하기 위한 것
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const reactFlowContainer = useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  useEffect(() => {
    if (nodes.length === 0) {
      reactFlow.setViewport(StepViewport);
    }
  }, [nodes, reactFlow]);

  const addNode = useMutation(
    ({ storage }, node: Node) => {
      const existingNodes = storage.get('nodes');
      storage.set('nodes', [...existingNodes, node]);
    },
    [nodes],
  );

  const onConnect = useMutation(
    ({ storage }, connection: Connection | Edge) => {
      const existingEdges = storage.get('edges');
      storage.set('edges', addEdge(connection, existingEdges));
      connectingNodeId.current = null;
    },
    [edges],
  );

  const onConnectStart = useCallback(
    (_: any, { nodeId }: { nodeId: string | null }) => {
      connectingNodeId.current = nodeId;
    },
    [],
  );

  const onConnectEnd = useCallback(
    (event: any) => {
      // 노드끼리 연결했을 때는 무시 -> 가치 엣지 생성
      if (!connectingNodeId.current) return;

      // 허공에 연결했을 때만 새로운 노드 생성
      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane) {
        const id = nanoid();

        if (!reactFlowInstance) {
          return;
        }

        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const previousNodeData = nodes.find(
          (node: Node) => node.id === connectingNodeId.current,
        ).data;

        const newNode = {
          id,
          position,
          type: 'middleNode',
          data: {
            label: `From ${previousNodeData.label}`,
            color: previousNodeData.color,
          },
          origin: [0.5, 0.0],
          dragHandle: '.dragHandle',
        };

        addNode(newNode);

        onConnect({
          source: connectingNodeId.current,
          target: id,
          style: { stroke: previousNodeData.color },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: previousNodeData.color,
          },
          type: 'default',
          id: nanoid(),
        });
      }
    },
    [reactFlowInstance, nodes, addNode, onConnect],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (!reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = nanoid();
      const newNode = {
        id,
        type,
        position,
        data: {
          label: 'New Node',
          color: nodeColor,
        },
        dragHandle: '.dragHandle',
      };

      addNode(newNode);
    },
    [reactFlowInstance, nodeColor, addNode],
  );

  const onNodesChange = useMutation(
    ({ storage }, changes: NodeChange[]) => {
      storage.set('nodes', applyNodeChanges(changes, nodes));
    },
    [nodes],
  );

  const onEdgesChange = useMutation(
    ({ storage }, changes: EdgeChange[]) => {
      storage.set('edges', applyEdgeChanges(changes, edges));
    },
    [edges],
  );

  // React Flow 컴포넌트만 캡처하는 기능
  const handleCaptureClick = useCallback(() => {
    if (!reactFlowContainer.current) {
      console.error('React Flow container element not found');
      return;
    }

    toPng(reactFlowContainer.current, { backgroundColor: '#ffffff' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'reactflow-capture.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Failed to capture React Flow:', error);
      });
  }, []);

  return (
    <div className="h-full w-full grow" ref={reactFlowWrapper}>
      <div ref={reactFlowContainer} style={{ width: '100%', height: '100%' }}>
        {/* React Flow Container를 감싸는 div */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          onDrop={onDrop}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineComponent={StakeholderConnectionLine}
          connectionLineStyle={connectionLineStyle}
          panOnDrag={false}
          panOnScroll={true}
          zoomOnDoubleClick={false}
        >
          <Controls />
        </ReactFlow>
      </div>
      <InputForNode addWhatNode={addNode} />
      <button
        onClick={handleCaptureClick}
        className="capture-button absolute bottom-[8rem] "
      >
        캡처하기
      </button>
    </div>
  );
};

const ReactFlowCanvas = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
};

export default ReactFlowCanvas;
