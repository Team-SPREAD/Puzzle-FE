import { LsonObject } from '@liveblocks/client';
import {
  CoordinateExtent,
  EdgeUpdatable,
  NodeHandleBounds,
  Position,
} from 'reactflow';

export type SoundType = {
  id: number;
  name: string;
  imgUrl: string;
  url: string;
};

export type UserInfo = {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  token: string;
};

export type TeamsInfo = {
  _id: string;
  teamName: string;
  users: string[];
  createdDate: string;
  updatedDate: string;
};
export type TeamsMember = {};

export type BoardInfo = {
  _id: string;
  boardName: string;
  description: string;
  boardImgUrl: string;
  currentStep: string;
  createdDate: string;
  updatedDate: string;
  team: string;
  like: boolean;
  __v: number;
};

export type Color = {
  r: number;
  g: number;
  b: number;
};

export enum LayerType {
  Rectangle,
  Ellipse,
  Path,
  Text,
  Note,
  Vision, // 2단계 Vision 추가
  TopicVote, // 3단계
  Spread, // 4단계 Spread 추가
  Discussion, // 5단계 토론하기
  Persona, // 6단계  Persona
  SolvingProblem, //7단계 문제해결
  UserStory, //8단계
}

export type Camera = {
  x: number;
  y: number;
};

export type Layer =
  | RectangleLayer
  | EllipseLayer
  | PathLayer
  | TextLayer
  | NoteLayer
  | VisionLayer
  | TopicVoteLayer
  | SpreadLayer
  | DiscussionLayer
  | PersonaLayer
  | SolvingProblemLayer
  | UserStoryLayer;

export type RectangleLayer = {
  type: LayerType.Rectangle;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
};

export type EllipseLayer = {
  type: LayerType.Ellipse;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
};

export type NoteLayer = {
  type: LayerType.Note;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value: string;
};

export type PathLayer = {
  type: LayerType.Path;
  x: number;
  y: number;
  // Could be computed based on points
  height: number;
  // Could be computed based on points
  width: number;
  fill: Color;
  points: number[][];
  strokeWidth?: number; //추가
};

export type TextLayer = {
  type: LayerType.Text;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
  isEditing?: boolean;
};

export type VisionLayer = {
  type: LayerType.Vision;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  borderColor: Color;
  value: string;
  fontStyle: string;
  iconUrl?: string;
  author?: string;
  creator?: {
    id: string;
    name: string;
    avatar?: string;
  };
};

// TopicVote 레이어 타입
export type TopicVoteLayer = {
  type: LayerType.TopicVote;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  value: string;
  borderColor: Color;
  fontStyle: string;
  iconUrl?: string;
  reactions: Record<
    string,
    {
      emoji: string;
      timestamp: number;
    }
  >;
};

// 3단계 주제선정에서 쓰이는 타입
export interface ReactionData {
  [userId: string]: {
    emoji: string;
    timestamp: number;
  };
}

//4단계 레이어

export type SpreadLayer = {
  type: LayerType.Spread;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  centerIdea: string;
  content?: string;
  direction?: 'up' | 'right' | 'down' | 'left';
  tag?: string;
};

//4단계 아이디어 레이어
export type Idea = {
  id: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  tag?: string;
  connections: string[];
  reactions: {
    [userId: string]: {
      emoji: string;
      timestamp: number;
    };
  };
};

// 5단계 기믹 타입 댓글 투표 토론
export type DiscussionCategory = 'category' | 'problem' | 'solution' | 'target';

export type VoteType = 'agree' | 'disagree' | 'neutral';

export type Comment = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: number;
  voteType: VoteType;
  category: DiscussionCategory;
  reactions: Record<string, { emoji: string; timestamp: number }>;
};

export type DiscussionLayer = {
  type: LayerType.Discussion;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  category: DiscussionCategory;
  topic: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'ongoing' | 'completed';
  votes: Record<string, { vote: VoteType; timestamp: number }>;
  comments: Comment[];
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  connectedTo?: string[]; // 연결된 다른 토론 카드들의 ID
};

// 페르소나 특성 타입 정의
export type PersonaTrait = {
  category: 'demographic' | 'psychographic' | 'behavioral' | 'needs';
  value: string;
};

// 페르소나 레이어 타입 정의
export type PersonaLayer = {
  type: LayerType.Persona;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  quote: string;
  emoji?: string; // 이모지는 선택적으로 설정
  traits: Array<{
    category: 'traits' | 'goals' | 'pain' | 'behavior';
    value: string;
  }>;
  borderColor: Color;
  fontStyle: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
};

export type SolvingProblemLayer = {
  type: LayerType.SolvingProblem;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  boxType: 'define' | 'analyze' | 'solve';
  content: string;
  isLocked: boolean;
  dependencies?: string[]; // 이전 박스들과의 연결 관계
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
};

//8단계 UserStory 레이어 타입
export type UserStoryLayer = {
  type: LayerType.UserStory; // 레이어의 타입 (LayerType.UserStory)
  x: number; // 레이어의 x 좌표 위치
  y: number; // 레이어의 y 좌표 위치
  width: number; // 레이어의 가로 크기
  height: number; // 레이어의 세로 크기
  who: string; // 'Who'에 해당하는 사용자
  goal: string; // 'Why'에 해당하는 목적
  action: string; // 'What'에 해당하는 활동/작업
  task: string; // 작업
  fill: Color; // 레이어의 배경 색상
  borderColor: {
    // 레이어의 테두리 색상 (RGB 형식)
    r: number;
    g: number;
    b: number;
  };
  fontStyle: string; // 레이어의 폰트 스타일
  iconUrl?: string; // 사용자 아이콘 URL (선택적)
};

export type Point = {
  x: number;
  y: number;
};

export type XYWH = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum Side {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export type CanvasState =
  | {
      mode: CanvasMode.None;
    }
  | {
      mode: CanvasMode.SelectionNet;
      origin: Point;
      current?: Point;
    }
  | {
      mode: CanvasMode.Translating;
      current: Point;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note;
    }
  | {
      mode: CanvasMode.Pencil;
    }
  | {
      mode: CanvasMode.Pressing;
      origin: Point;
    }
  | {
      mode: CanvasMode.Resizing;
      initialBounds: XYWH;
      corner: Side;
    };

export enum CanvasMode {
  /**
   * Default canvas mode. Nothing is happening.
   */
  None,
  /**
   * When the user's pointer is pressed
   */
  Pressing,
  /**
   * When the user is selecting multiple layers at once
   */
  SelectionNet,
  /**
   * When the user is moving layers
   */
  Translating,
  /**
   * When the user is going to insert a Rectangle or an Ellipse
   */
  Inserting,
  /**
   * When the user is resizing a layer
   */
  Resizing,
  /**
   * When the pencil is activated
   */
  Pencil,
}

export type Process = {
  step: number;
  title: string;
  description: string;
  camera: { x: number; y: number };
  done: boolean;
  // 현재 안 쓰이는 단계, 필요하면 쓰는 걸로, 게임을 위해서 만들어봄
  // iceBreaking?: {
  //   isGameActive: boolean;
  //   game?: IceBreakingGame;
  //   introductions: {
  //     userId: string;
  //     content: string;
  //     position: Point;
  //   }[];
  // };
};

// export type IceBreakingGame = {
//   type: 'random-question' | 'word-chain' | 'drawing-guess';
//   isPlaying: boolean;
//   participants: string[];
//   currentTurn?: string;
// };

export type SerializableNode = LsonObject & {
  id: string;
  position: { x: number; y: number };
  data: any;
  type?: string;
  style?: string;
  className?: string;
  sourcePosition?: Position;
  targetPosition?: Position;
  hidden?: boolean;
  selected?: boolean;
  dragging?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  deletable?: boolean;
  dragHandle?: string;
  width?: number | null;
  height?: number | null;
  parentNode?: string;
  parentId?: string;
  zIndex?: number;
  extent?: 'parent' | CoordinateExtent;
  expandParent?: boolean;
  positionAbsolute?: { x: number; y: number };
  ariaLabel?: string;
  focusable?: boolean;
  resizing?: boolean;
  internalsSymbol?: {
    z?: number;
    handleBounds?: NodeHandleBounds;
    isParent?: boolean;
  };
};
