'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { nanoid } from 'nanoid';
import {
  useMutation,
  useHistory,
  useStorage,
  useSelf,
  useOthersMapped,
  useCanUndo,
  useCanRedo,
  useMyPresence,
} from '@/liveblocks.config';
import { LiveObject } from '@liveblocks/client';
import {
  Color,
  Layer,
  LayerType,
  CanvasState,
  CanvasMode,
  Camera,
  Side,
  XYWH,
  Point,
} from '@/lib/types';
import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from '@/lib/utils';
import SelectionBox from '@/components/SelectionBox';
import LayerComponent from '@/components/LayerComponent';
import SelectionTools from '@/components/SelectionTools';
import useDisableScrollBounce from '@/hooks/useDisableScrollBounce';
import useDeleteLayers from '@/hooks/useDeleteLayers';
import Drafts from '@/components/Drafts';
import Path from '@/components/Path';
import ToolsBar from '@/components/ToolsBar';
import Cursors from '@/components/Cursors';
import useUserInfoStore from '@/hooks/useUserInfoStore';
import RightNav from '../Layout/RightNav';
import Avatar from '@/components/Avatar';
import ProcessNav from '@/components/Layout/ProcessNav/Index';
import { steps } from '@/lib/process-data';
import {
  IceBreakingArea,
  VisionFinding,
  TopicSelection,
  SpreadIdeas,
  Discussion,
  Persona,
  ProblemSolving,
  UserStory,
  RoleAssignment,
  Result,
} from '../Templates';

const MAX_LAYERS = 100;

const Canvas = () => {
  const userInfo = useUserInfoStore();
  const layerIds = useStorage((root) => root.layerIds);
  const cursorPanel = useRef(null);
  const [currentStep, setCurrentStep] = useState(1); //프로젝트 1단계
  const [penSize, setPenSize] = useState(16); //펜 사이즈 use
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);
  const [selectedLayerId, setSelectedLayerId] = useState<string | undefined>(); //text 컬러 상태관리
  const [canvasState, setState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const handleSetCamera = useCallback((position: { x: number; y: number }) => {
    //postion 객체 안에 zoom: number 제거함
    setCamera({ x: position.x, y: position.y });
    const newStep =
      steps.findIndex(
        (step) => step.camera.x === position.x && step.camera.y === position.y,
      ) + 1;
    setCurrentStep(newStep);
  }, []);

  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 252,
    g: 142,
    b: 42,
  });
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useDisableScrollBounce();

  const deleteLayers = useDeleteLayers();

  const renderStageTemplate = () => {
    switch (currentStep) {
      case 1:
        return <IceBreakingArea camera={camera} />;
      case 2:
        return <VisionFinding camera={camera} />;
      case 3:
        return <TopicSelection camera={camera} />;
      case 4:
        return <SpreadIdeas camera={camera}  />;
      case 5:
        return <Discussion camera={camera}  />;
      case 6:
        return <Persona camera={camera}  />;
      case 7:
        return <ProblemSolving camera={camera}  />;
      case 8:
        return <UserStory camera={camera}  />;
      case 9:
        return <RoleAssignment camera={camera}  />;
      case 10:
        return <Result camera={camera} />;
      default:
        return null;
    }
  };

  /**
   * 단계를 위한 useEffect
   *
   */
  useEffect(() => {
    const currentStepData = steps[currentStep - 1];
    if (currentStepData) {
      setCamera({ x: currentStepData.camera.x, y: currentStepData.camera.y });
    }
  }, [currentStep]);

  /**
   * Hook used to listen to Undo / Redo and delete selected layers
   */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Backspace': {
          deleteLayers();
          break;
        }
        case 'z': {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [deleteLayers, history]);

  /**
   * Select the layer if not already selected and start translating the selection
   */
  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();
      const point = pointerEventToCanvasPoint(e, camera);
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setState({ mode: CanvasMode.Translating, current: point });
    },
    [setState, camera, history, canvasState.mode],
  );

  /**
   * Start resizing the layer
   */
  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history],
  );

  /**
   * Insert an ellipse or a rectangle at the given position and select it
   */
  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Note
        | LayerType.Text,
      position: Point,
    ) => {
      const liveLayers = storage.get('layers');
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get('layerIds');
      const layerId = nanoid();

      // 기본 레이어 속성
      const baseLayerProps = {
        x: position.x,
        y: position.y,
      };

      // 타입 캐스팅을 사용하여 Layer 타입으로 변환
      const layer = (() => {
        if (layerType === LayerType.Note) {
          return {
            ...baseLayerProps,
            type: LayerType.Note,
            width: 180,
            height: 180,
            fill: { r: 255, g: 244, b: 189 },
            value: '',
          };
        } else if (layerType === LayerType.Text) {
          return {
            ...baseLayerProps,
            type: LayerType.Text,
            width: 200,
            height: 40,
            fill: lastUsedColor,
            value: '',
          };
        } else {
          return {
            ...baseLayerProps,
            type: layerType,
            width: 100,
            height: 100,
            fill: lastUsedColor,
          };
        }
      })();

      liveLayerIds.push(layerId);

      // as unknown as Layer를 사용하여 타입 에러 해결
      liveLayers.set(layerId, new LiveObject(layer as unknown as Layer));

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setState({ mode: CanvasMode.None });
    },
    [lastUsedColor],
  );

  const insertInitialLayer = useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayers = storage.get('layers');
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get('layerIds');
      const layerId = nanoid();
      const layer = new LiveObject({
        type: LayerType.Ellipse,
        x: 100,
        y: 100,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      });
      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer as unknown as LiveObject<Layer>);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setState({ mode: CanvasMode.None });
    },
    [lastUsedColor],
  );

  /**
   * Transform the drawing of the current user in a layer and reset the presence to delete the draft.
   */
  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get('layers');
      const { pencilDraft } = self.presence;
      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();

      //penPointesToPathLayer에 strokeWidth 전달
      liveLayers.set(
        id,
        new LiveObject({
          ...penPointsToPathLayer(pencilDraft, lastUsedColor),
          strokeWidth: penSize, // 여기에 penSize 추가
        }),
      );

      const liveLayerIds = storage.get('layerIds');
      liveLayerIds.push(id);
      setMyPresence({ pencilDraft: null });
    },
    [lastUsedColor, penSize], // penSize 의존성 추가
  );

  /**
   * Move selected layers on the canvas
   */
  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get('layers');
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            x: layer.get('x') + offset.x,
            y: layer.get('y') + offset.y,
          });
        }
      }

      setState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState],
  );

  /**
   * Resize selected layer. Only resizing a single layer is allowed.
   */
  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point,
      );

      const liveLayers = storage.get('layers');
      const layer = liveLayers.get(self.presence.selection[0]);
      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState],
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  /**
   * Insert the first path point and start drawing with the pencil
   */
  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor],
  );

  /**
   * Continue the drawing and send the current draft to other users in the room
   */
  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;
      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode],
  );

  /**
   * Start multiselection with the selection net if the pointer move enough since pressed
   */
  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    // If the distance between the pointer position and the pointer position when it was pressed
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      // Start multi selection
      setState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  /**
   * Update the position of the selection net and select the layers accordingly
   */
  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get('layers').toImmutable();
      setState({
        mode: CanvasMode.SelectionNet,
        origin: origin,
        current,
      });
      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current,
      );
      setMyPresence({ selection: ids });
    },
    [layerIds],
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  /**
   * Create a map layerId to color based on the selection of all the users in the room
   */
  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;
      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    // Pan the camera based on the wheel delta
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      setState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState.mode, setState, startDrawing],
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }
      setMyPresence({ cursor: current });
    },
    [
      camera,
      canvasState,
      continueDrawing,
      resizeSelectedLayer,
      startMultiSelection,
      translateSelectedLayers,
      updateSelectionNet,
    ],
  );

  const onPointerLeave = useMutation(
    ({ setMyPresence }) => setMyPresence({ cursor: null }),
    [],
  );

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setState({
          mode: CanvasMode.None,
        });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setState({
          mode: CanvasMode.None,
        });
      }
      history.resume();
    },
    [
      camera,
      canvasState,
      history,
      insertLayer,
      insertPath,
      setState,
      unselectLayers,
    ],
  );

  // Insert the first layer when the user joins the room
  useEffect(() => {
    if (layerIds.length === 0) {
      insertInitialLayer();
    }
  }, [insertInitialLayer, layerIds.length]);

  // Path 컴포넌트에 전달할 getStroke 옵션
  const strokeOptions = useMemo(
    () => ({
      size: penSize,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    }),
    [penSize],
  );

  return (
    <div className="w-full h-screen flex flex-col relative bg-surface-canvas touch-none overflow-hidden">
      <ProcessNav
        userInfo={userInfo}
        setCamera={handleSetCamera}
        currentStep={currentStep}
        processes={steps}
      />

      <div className="flex-1 relative">
        {/* 현재 단계의 템플릿 렌더링 */}
        {renderStageTemplate()}
        <div className="absolute top-40 left-4 z-20">
          <RightNav />
        </div>

        <div
          className="w-full h-full relative bg-surface-canvas touch-none"
          ref={cursorPanel}
        >
          <Cursors cursorPanel={cursorPanel} />
          <SelectionTools
            isAnimated={
              canvasState.mode !== CanvasMode.Translating &&
              canvasState.mode !== CanvasMode.Resizing
            }
            camera={camera}
            setLastUsedColor={setLastUsedColor}
          />
          <svg
            className="w-full h-full"
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            onPointerUp={onPointerUp}
          >
            <g
              style={{
                transform: `translate(${camera.x}px, ${camera.y}px)`,
              }}
            >
              {layerIds.map((layerId) => (
                <LayerComponent
                  key={layerId}
                  id={layerId}
                  mode={canvasState.mode}
                  onLayerPointerDown={onLayerPointerDown}
                  selectionColor={layerIdsToColorSelection[layerId]}
                />
              ))}
              <SelectionBox
                onResizeHandlePointerDown={onResizeHandlePointerDown}
              />
              {canvasState.mode === CanvasMode.SelectionNet &&
                canvasState.current != null && (
                  <rect
                    className="fill-primary opacity-5 stroke-primary stroke-[0.5px]"
                    x={Math.min(canvasState.origin.x, canvasState.current.x)}
                    y={Math.min(canvasState.origin.y, canvasState.current.y)}
                    width={Math.abs(
                      canvasState.origin.x - canvasState.current.x,
                    )}
                    height={Math.abs(
                      canvasState.origin.y - canvasState.current.y,
                    )}
                  />
                )}
              <Drafts />
              {pencilDraft != null && pencilDraft.length > 0 && (
                <Path
                  points={pencilDraft}
                  fill={colorToCss(lastUsedColor)}
                  x={0}
                  y={0}
                  strokeOptions={strokeOptions} // strokeOptions 전달
                />
              )}
            </g>
          </svg>
        </div>

        <div className="absolute bottom-4 left-4 z-30">
          <ToolsBar
            canvasState={canvasState}
            setCanvasState={setState}
            undo={history.undo}
            redo={history.redo}
            canUndo={canUndo}
            canRedo={canRedo}
            penSize={penSize}
            setPenSize={setPenSize}
            currentColor={lastUsedColor} // 추가
            onColorChange={setLastUsedColor}
          />
        </div>
      </div>
      <div className="absolute bottom-0 right-0 z-30">
        <RightNav />
      </div>
    </div>
  );
};

export default Canvas;
