type Tool = {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  category: string;
  imageUrl: string;
  price: string;
  area: string;
  postalCode: string;
  owner: number;
};

type submitTool = Omit<Tool, "id" | "owner"> & { id?: string };

type MyTool = Tool & { pendingCount?: number };

export type { Tool, submitTool, MyTool };
