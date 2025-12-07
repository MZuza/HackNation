export const getEventValue = (event: Event) => {
  return (event.target as HTMLInputElement).value;
};

export const getEventSelectValue = (event: Event) => {
  return (event.target as HTMLSelectElement).value;
};

export const selectTarget = (event: Event) => {
  return (event.target as HTMLInputElement).select();
};
