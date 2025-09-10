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
  ownerId: string;
};

type submitTool = Omit<Tool, "id" | "ownerId"> & { id?: string };

type MyTool = Tool & { pendingCount?: number };

export type { Tool, submitTool, MyTool };
