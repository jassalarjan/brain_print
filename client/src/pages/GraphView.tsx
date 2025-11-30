import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowRight } from 'lucide-react';

// Custom node component
const TraitNode = ({ data }: any) => {
  return (
    <div
      className="px-4 py-3 rounded-lg border-2 bg-white shadow-lg transition-all hover:shadow-xl"
      style={{
        borderColor: data.color,
        minWidth: '120px',
      }}
    >
      <div className="text-center">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {data.label}
        </div>
        <div className="text-2xl font-bold mt-1" style={{ color: data.color }}>
          {data.score}
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  trait: TraitNode,
};

export function GraphView() {
  const navigate = useNavigate();
  const { scores, correlations } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!scores) {
      navigate('/questionnaire');
      return;
    }

    // Create nodes from scores
    const traitEntries = Object.entries(scores);
    const radius = 300;
    const centerX = 400;
    const centerY = 300;

    const createdNodes: Node[] = traitEntries.map(([trait, score], index) => {
      const angle = (index / traitEntries.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Color based on score
      const getColor = (score: number) => {
        if (score >= 80) return '#8b5cf6'; // purple
        if (score >= 60) return '#3b82f6'; // blue
        if (score >= 40) return '#06b6d4'; // cyan
        return '#6b7280'; // gray
      };

      return {
        id: trait,
        type: 'trait',
        position: { x: x - 60, y: y - 30 },
        data: {
          label: trait.replace(/([A-Z])/g, ' $1').trim(),
          score,
          color: getColor(score),
        },
      };
    });

    setNodes(createdNodes);

    // Create edges from correlations
    const createdEdges: Edge[] = correlations.slice(0, 8).map((corr, index) => {
      const trait1 = Object.keys(scores).find(
        (t) => t.replace(/([A-Z])/g, ' $1').trim() === corr.trait1
      );
      const trait2 = Object.keys(scores).find(
        (t) => t.replace(/([A-Z])/g, ' $1').trim() === corr.trait2
      );

      if (!trait1 || !trait2) return null;

      return {
        id: `${trait1}-${trait2}`,
        source: trait1,
        target: trait2,
        animated: corr.strength > 0.6,
        style: {
          stroke: corr.strength > 0.6 ? '#8b5cf6' : '#94a3b8',
          strokeWidth: Math.max(1, corr.strength * 3),
        },
      };
    }).filter(Boolean) as Edge[];

    setEdges(createdEdges);
  }, [scores, correlations, navigate, setNodes, setEdges]);

  if (!scores) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-8rem)] px-4 py-6">
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold">Your Cognitive Context Graph</h1>
          <p className="text-muted-foreground">
            Node size and color represent trait strength • Lines show correlations
          </p>
        </motion.div>

        {/* Graph Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 rounded-lg border-2 bg-white overflow-hidden shadow-lg"
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Background />
            <Controls />
            <MiniMap
              nodeColor={(node) => node.data.color}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={() => navigate('/insights')}
            data-testid="view-insights-btn"
          >
            View Detailed Insights
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
