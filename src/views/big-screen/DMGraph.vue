
<template>
  <button @click="changeNodeStatus">测试用按钮</button>
  <div id="container-DMG"></div>
</template>


<script>
/* eslint-disable */
import { defineComponent, ref, onMounted, nextTick } from 'vue';
import { Graph, Path } from '@antv/x6';
import { register, getTeleport } from '@antv/x6-vue-shape';

export default defineComponent({
  name: 'DMGraph',
  props: {
    //
  },
  setup(props) {
    const image = {
      logo: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ',
      success: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ',
      failed: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ',
      running: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*t8fURKfgSOgAAAAAAAAAAAAAARQnAQ',
    };

    const AlgoNode = (props) => {
      const { node } = props;
      const data = node.getData();
      const { label, status = 'default' } = data;
      /* eslint-disable */
      return (
        <div className={`node ${status}`}>
          <img src={image.logo} alt="logo" />
          <span className="label">{label}</span>
          <span className="status">
            {status === 'success' && <img src={image.success} alt="success" />}
            {status === 'failed' && <img src={image.failed} alt="failed" />}
            {status === 'running' && <img src={image.running} alt="running" />}
          </span>
        </div>
      );
    };
    /* eslint-disable */

    register({
      shape: 'dag-node',
      width: 180,
      height: 36,
      component: AlgoNode,
      ports: {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#C2C8D5',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#C2C8D5',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
        },
      },
    });

    Graph.registerEdge(
      'dag-edge',
      {
        inherit: 'edge',
        attrs: {
          line: {
            stroke: '#C2C8D5',
            strokeWidth: 1,
            targetMarker: null,
          },
        },
      },
      true
    );

    Graph.registerConnector(
      'algo-connector',
      (s, e) => {
        const offset = 4;
        const deltaY = Math.abs(e.y - s.y);
        const control = Math.floor((deltaY / 3) * 2);

        const v1 = { x: s.x, y: s.y + offset + control };
        const v2 = { x: e.x, y: e.y - offset - control };

        return Path.normalize(
          `M ${s.x} ${s.y}
       L ${s.x} ${s.y + offset}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
       L ${e.x} ${e.y}
      `
        );
      },
      true
    );

    let graph;
    onMounted(() => {
      graph = new Graph({
        container: document.getElementById('container-DMG'),
        width: 740,
        height: 380,
        highlighting: {
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#31d0c6',
                strokeWidth: 4,
              },
            },
          },
        },
        connecting: {
          snap: true,
          allowBlank: false,
          allowLoop: false,
          highlight: true,
          connector: 'algo-connector',
          connectionPoint: 'anchor',
          anchor: 'center',
          validateMagnet({ magnet }) {
            return magnet.getAttribute('port-group') !== 'top';
          },
          createEdge() {
            return graph.createEdge({
              shape: 'dag-edge',
              attrs: {
                line: {
                  strokeDasharray: '5 5',
                },
              },
              zIndex: -1,
            });
          },
        },
      });

      graph.on('edge:connected', ({ edge }) => {
        edge.attr({
          line: {
            strokeDasharray: '',
          },
        });
      });

      graph.on('node:change:data', ({ node }) => {
        const edges = graph.getIncomingEdges(node);
        const { status } = node.getData();
        edges.forEach((edge) => {
          if (status === 'running') {
            edge.attr('line/strokeDasharray', 5);
            edge.attr('line/style/animation', 'running-line 30s infinite linear');
          } else {
            edge.attr('line/strokeDasharray', '');
            edge.attr('line/style/animation', '');
          }
        });
      });

      let a = getNodeData();
      init(a);
    });

    const init = (data) => {
      const cells = [];
      data.forEach((item) => {
        if (item.shape === 'dag-node') {
          cells.push(graph.createNode(item));
        } else {
          cells.push(graph.createEdge(item));
        }
      });
      graph.resetCells(cells);
      graph.centerContent();
    };

    const getNodeData = () => {
      return [
        {
          id: '1',
          shape: 'dag-node',
          x: 250,
          y: 0,
          data: {
            label: '系统初始化与参数加载',
            status: 'success',
          },
          ports: [
            {
              id: '1-1',
              group: 'bottom',
            },
          ],
        },
        {
          id: '2',
          shape: 'dag-node',
          x: 0,
          y: 80,
          data: {
            label: '干净样本推理测试',
            status: 'running',
          },
          ports: [
            {
              id: '2-1',
              group: 'top',
            },
            {
              id: '2-2',
              group: 'bottom',
            },
          ],
        },
        {
          id: '3',
          shape: 'dag-node',
          x: 375,
          y: 80,
          data: {
            label: '对抗攻击并生成对抗样本',
          },
          ports: [
            {
              id: '3-1',
              group: 'top',
            },
            {
              id: '3-2',
              group: 'bottom',
            },
            {
              id: '3-3',
              group: 'bottom',
            },
          ],
        },
        {
          id: '4',
          shape: 'dag-node',
          x: 250,
          y: 160,
          data: {
            label: '对抗样本推理测试',
          },
          ports: [
            {
              id: '4-1',
              group: 'top',
            },
            {
              id: '4-2',
              group: 'bottom',
            },
          ],
        },
        {
          id: '5',
          shape: 'dag-node',
          x: 500,
          y: 160,
          data: {
            label: '攻击代价测试',
          },
          ports: [
            {
              id: '5-1',
              group: 'top',
            },
            {
              id: '5-2',
              group: 'bottom',
            },
          ],
        },
        {
          id: '6',
          shape: 'dag-node',
          x: 250,
          y: 240,
          data: {
            label: '攻击前后推理结果评估',
          },
          ports: [
            {
              id: '6-1',
              group: 'top',
            },
            {
              id: '6-2',
              group: 'bottom',
            },
          ],
        },
        {
          id: '7',
          shape: 'dag-node',
          x: 500,
          y: 240,
          data: {
            label: '攻击代价评估',
          },
          ports: [
            {
              id: '7-1',
              group: 'top',
            },
            {
              id: '7-2',
              group: 'bottom',
            },
          ],
        },
        {
          id: '8',
          shape: 'dag-node',
          x: 0,
          y: 240,
          data: {
            label: '模型能力评估',
          },
          ports: [
            {
              id: '8-1',
              group: 'top',
            },
            {
              id: '8-2',
              group: 'bottom',
            },
          ],
        },
        {
          id: '9',
          shape: 'dag-node',
          x: 125,
          y: 320,
          data: {
            label: '模型综合评估',
          },
          ports: [
            {
              id: '9-1',
              group: 'top',
            },
          ],
        },
        {
          id: '10',
          shape: 'dag-node',
          x: 375,
          y: 320,
          data: {
            label: '攻击方法综合评估',
          },
          ports: [
            {
              id: '10-1',
              group: 'top',
            },
          ],
        },
        {
          id: '100',
          shape: 'dag-edge',
          source: {
            cell: '1',
            port: '1-1',
          },
          target: {
            cell: '2',
            port: '2-1',
          },
          zIndex: 0,
        },
        {
          id: '101',
          shape: 'dag-edge',
          source: {
            cell: '1',
            port: '1-1',
          },
          target: {
            cell: '3',
            port: '3-1',
          },
          zIndex: 0,
        },
        {
          id: '102',
          shape: 'dag-edge',
          source: {
            cell: '3',
            port: '3-2',
          },
          target: {
            cell: '4',
            port: '4-1',
          },
          zIndex: 0,
        },
        {
          id: '103',
          shape: 'dag-edge',
          source: {
            cell: '3',
            port: '3-3',
          },
          target: {
            cell: '5',
            port: '5-1',
          },
          zIndex: 0,
        },
        {
          id: '104',
          shape: 'dag-edge',
          source: {
            cell: '4',
            port: '4-2',
          },
          target: {
            cell: '6',
            port: '6-1',
          },
          zIndex: 0,
        },
        {
          id: '105',
          shape: 'dag-edge',
          source: {
            cell: '5',
            port: '5-2',
          },
          target: {
            cell: '7',
            port: '7-1',
          },
          zIndex: 0,
        },
        {
          id: '106',
          shape: 'dag-edge',
          source: {
            cell: '2',
            port: '2-2',
          },
          target: {
            cell: '8',
            port: '8-1',
          },
          zIndex: 0,
        },
        {
          id: '107',
          shape: 'dag-edge',
          source: {
            cell: '2',
            port: '2-2',
          },
          target: {
            cell: '6',
            port: '6-1',
          },
          zIndex: 0,
        },
        {
          id: '108',
          shape: 'dag-edge',
          source: {
            cell: '6',
            port: '6-2',
          },
          target: {
            cell: '9',
            port: '9-1',
          },
          zIndex: 0,
        },
        {
          id: '109',
          shape: 'dag-edge',
          source: {
            cell: '7',
            port: '7-2',
          },
          target: {
            cell: '9',
            port: '9-1',
          },
          zIndex: 0,
        },
        {
          id: '110',
          shape: 'dag-edge',
          source: {
            cell: '8',
            port: '8-2',
          },
          target: {
            cell: '9',
            port: '9-1',
          },
          zIndex: 0,
        },
        {
          id: '111',
          shape: 'dag-edge',
          source: {
            cell: '6',
            port: '6-2',
          },
          target: {
            cell: '10',
            port: '10-1',
          },
          zIndex: 0,
        },
        {
          id: '112',
          shape: 'dag-edge',
          source: {
            cell: '7',
            port: '7-2',
          },
          target: {
            cell: '10',
            port: '10-1',
          },
          zIndex: 0,
        },
      ];
    };

    // 显示节点状态
    const showNodeStatus = async (status) => {
      status.forEach((item) => {
        const { id, status } = item;
        const node = graph.getCellById(id);
        const data = node.getData();
        node.setData({
          ...data,
          status,
        });
        graph.resetCells(graph.getCells());
      });
    };

    const changeNodeStatus = async () => {
      let status = [
        {
          id: '1',
          status: 'success',
        },
        {
          id: '2',
          status: 'success',
        },
        {
          id: '3',
          status: 'running',
        },
        {
          id: '4',
          status: 'failed',
        },
        {
          id: '5',
          status: 'failed',
        },
        {
          id: '6',
          status: 'failed',
        },
        {
          id: '7',
          status: 'failed',
        },
        {
          id: '8',
          status: 'success',
        },
        {
          id: '9',
          status: 'failed',
        },
        {
          id: '10',
          status: 'failed',
        },
      ];
      await showNodeStatus(status);
    };

    return {
      changeNodeStatus,
    };
  },
});
</script>
<style lang="less">
.node {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 0px;
  border-left: 4px solid #5f95ff;
  border-radius: 4px;
  background: rgba(115, 103, 240, 0.16);
  box-shadow: 0 0.25rem 1.25rem rgba(15, 20, 34, 0.4);
}
.node img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-left: 8px;
}
.node .label {
  display: inline-block;
  flex-shrink: 0;
  width: 140px;
  margin-left: 8px;
  color: #cfd3ec;
  font-size: 12px;
}
.node .status {
  flex-shrink: 0;
}
.node.success {
  border-left: 4px solid #28c76f;
}
.node.failed {
  border-left: 4px solid #ff4d4f;
}
.node.running .status img {
  animation: spin 1s linear infinite;
}
.x6-node-selected .node {
  border-color: #1890ff;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #d4e8fe;
}
.x6-node-selected .node.success {
  border-color: #28c76f;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #ccecc0;
}
.x6-node-selected .node.failed {
  border-color: #ff4d4f;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #fedcdc;
}
.x6-edge:hover path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1px;
}

.x6-edge-selected path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1.5px !important;
}

@keyframes running-line {
  to {
    stroke-dashoffset: -1000;
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
