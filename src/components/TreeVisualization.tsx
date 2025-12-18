import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useAlgorithm } from '../hooks/useAlgorithm';
import type { TreeNode, NodeStatus } from '../types';
import './TreeVisualization.css';

const NODE_RADIUS = 30;
const VERTICAL_SPACING = 100;
const HORIZONTAL_SPACING = 70;

const statusColors: Record<NodeStatus, string> = {
  exploring: '#2196F3',
  success: '#4CAF50',
  pruned: '#f44336',
  backtracked: '#9e9e9e',
  idle: '#e0e0e0',
};



export function TreeVisualization() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, currentStep } = useAlgorithm();
  const { treeData, target, highlightedPath } = state;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !treeData) return;

    // 检查节点是否在高亮路径上
    const isNodeInHighlightedPath = (node: d3.HierarchyPointNode<TreeNode>): boolean => {
      if (!highlightedPath) return false;
      const nodePath = node.data.pathFromRoot;
      // 节点路径必须是高亮路径的前缀或完全匹配
      if (nodePath.length > highlightedPath.length) return false;
      return nodePath.every((v, i) => v === highlightedPath[i]);
    };

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Create hierarchy
    const root = d3.hierarchy(treeData);
    
    // Calculate tree layout
    const treeLayout = d3.tree<TreeNode>()
      .nodeSize([HORIZONTAL_SPACING, VERTICAL_SPACING]);
    
    const treeData2 = treeLayout(root);
    const nodes = treeData2.descendants();
    const links = treeData2.links();

    // Calculate bounds
    let minX = Infinity, maxX = -Infinity;
    nodes.forEach(d => {
      if (d.x < minX) minX = d.x;
      if (d.x > maxX) maxX = d.x;
    });

    const treeWidth = maxX - minX + NODE_RADIUS * 4;
    const treeHeight = (root.height + 1) * VERTICAL_SPACING + NODE_RADIUS * 2;
    
    // Center the tree
    const offsetX = width / 2 - (minX + maxX) / 2;
    const offsetY = NODE_RADIUS + 30;
    g.attr('transform', `translate(${offsetX}, ${offsetY})`);

    // Draw links with gradient based on status
    g.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d) => {
        return `M${d.source.x},${d.source.y}C${d.source.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${d.target.y}`;
      })
      .attr('fill', 'none')
      .attr('stroke', d => {
        // 高亮路径优先
        if (isNodeInHighlightedPath(d.target)) return '#FF9800';
        const status = d.target.data.status;
        if (status === 'success') return '#4CAF50';
        if (status === 'pruned') return '#f44336';
        return '#ccc';
      })
      .attr('stroke-width', d => isNodeInHighlightedPath(d.target) ? 4 : 2)
      .attr('stroke-dasharray', d => d.target.data.status === 'pruned' ? '5,5' : 'none');

    // Draw nodes
    const nodeGroups = g.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Node circles
    nodeGroups.append('circle')
      .attr('r', NODE_RADIUS)
      .attr('fill', d => statusColors[d.data.status])
      .attr('stroke', d => isNodeInHighlightedPath(d) ? '#FF9800' : '#fff')
      .attr('stroke-width', d => isNodeInHighlightedPath(d) ? 4 : 2);

    // Root node special display
    nodeGroups.filter(d => d.data.depth === 0)
      .append('text')
      .attr('dy', -3)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('🎯 起点');

    nodeGroups.filter(d => d.data.depth === 0)
      .append('text')
      .attr('dy', 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.9)')
      .attr('font-size', '11px')
      .text(`要凑 ${target}`);

    // Non-root nodes: show selected number prominently
    nodeGroups.filter(d => d.data.depth > 0)
      .append('text')
      .attr('dy', -5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(d => `选 ${d.data.value}`);

    // Non-root nodes: show remaining sum with clearer text
    nodeGroups.filter(d => d.data.depth > 0)
      .append('text')
      .attr('dy', 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.9)')
      .attr('font-size', '10px')
      .text(d => {
        if (d.data.remaining === 0) return '✓ 刚好!';
        if (d.data.remaining < 0) return `超了 ${-d.data.remaining}`;
        return `还差 ${d.data.remaining}`;
      });

    // Status label below node - show for success and pruned nodes
    nodeGroups.filter(d => d.data.status === 'success' || d.data.status === 'pruned')
      .append('text')
      .attr('dy', NODE_RADIUS + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', d => statusColors[d.data.status])
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text(d => d.data.status === 'success' ? '✅ 答案!' : '❌ 不行');

    // Show the full path for success nodes
    nodeGroups.filter(d => d.data.status === 'success')
      .append('text')
      .attr('dy', NODE_RADIUS + 32)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4CAF50')
      .attr('font-size', '10px')
      .text(d => {
        const path: number[] = [];
        let node: d3.HierarchyPointNode<TreeNode> | null = d;
        while (node && node.parent) {
          path.unshift(node.data.value);
          node = node.parent;
        }
        return `[${path.join('+')}]=${target}`;
      });

    // Enable zoom and pan
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Fit to view if tree is larger than container
    if (treeWidth > width || treeHeight > height) {
      const scale = Math.min(width / treeWidth, height / treeHeight) * 0.85;
      svg.call(zoom.transform, d3.zoomIdentity
        .translate(width / 2, offsetY)
        .scale(scale)
        .translate(-(minX + maxX) / 2, 0)
      );
    }
  }, [treeData, currentStep, target, highlightedPath]);

  if (!treeData) {
    return (
      <div className="tree-visualization" ref={containerRef}>
        <div className="placeholder">
          <div className="placeholder-icon">🎯</div>
          <div className="placeholder-title">组合求和可视化</div>
          <div className="placeholder-text">
            这个工具帮你理解"回溯算法"是怎么工作的
          </div>
          <div className="placeholder-steps">
            <div>1️⃣ 在左边输入一些数字（候选数）</div>
            <div>2️⃣ 输入一个目标和</div>
            <div>3️⃣ 点击"开始"，看算法如何找出所有加起来等于目标的组合</div>
          </div>
          <div className="placeholder-example">
            例如：数字 [2,3,6,7]，目标 7 → 答案是 [7] 和 [2,2,3]
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tree-visualization" ref={containerRef}>
      <svg ref={svgRef}></svg>
      <div className="legend">
        <div className="legend-title">🎨 颜色说明</div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: statusColors.exploring }}></span>
          <span>🔍 正在尝试这条路</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: statusColors.success }}></span>
          <span>✅ 成功！找到答案</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: statusColors.pruned }}></span>
          <span>❌ 失败，数字加起来超了</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: statusColors.backtracked }}></span>
          <span>↩️ 已经试过，换别的</span>
        </div>
      </div>
      <div className="help-tip">
        💡 提示：每个圆圈代表"选择一个数字"，从上往下看就是选择的顺序
      </div>
    </div>
  );
}
