export interface DataProposalListItem {
  id: number;
  type: string;
  attributes: {
    title: string;
    notes: string;
    date_added: string;
    published_at: string;
  };
}
