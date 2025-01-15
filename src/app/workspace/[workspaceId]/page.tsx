"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const {data} = useGetWorkspace({id: workspaceId});
  return (
    <div>
      <h1>WorkspaceIdPage ID:{workspaceId}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
export default WorkspaceIdPage;
