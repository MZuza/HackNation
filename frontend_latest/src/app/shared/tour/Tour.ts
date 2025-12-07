export interface Tour {
  name: string;
  id: string;
  items: Array<TourItem>;
  progress?: TourProgress;
}

export interface TourProgress {
  tourId: string;
  currentStepIndex: number;
  currentStepRoute: string;
}

export interface ShepardStep {
  title: string;
  text: string;
  attachTo: {
    element: string;
    on: TourItemPosition;
  };
  buttons: Array<any>;
  id: string;
}

export interface TourItem {
  name: string;
  content: string;
  route: string;
  css_selector: string;
  is_optional: boolean;
  is_clickable: boolean;
  is_expandable: boolean;
  expanded?: boolean;
  position: TourItemPosition;
}

export enum TourItemPosition {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
}
