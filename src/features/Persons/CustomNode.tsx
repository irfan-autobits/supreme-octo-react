// project/src/features/Persons/CustomNode.tsx
import React from 'react';
import ReactFlow, { Handle, NodeProps, Position } from 'reactflow';

interface CustomNodeData { label: string }

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data }) => (
  <div className="reactflow__node" style={{ padding: 10, background: '#fff', border: '1px solid #ddd', borderRadius: 4, whiteSpace: 'pre-wrap' }}>
    {data.label}
    <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
  </div>
);

export default CustomNode;
