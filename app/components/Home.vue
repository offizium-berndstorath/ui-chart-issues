<template>
  <Page>
    <GridLayout height="100%" rows="125, 125" columns="42, *, 42" backgroundColor="#F2F2F2">
      <BarChart row="1" col="1" ref="chart" @loaded="onChartLoaded" height="100%" width="100%" />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { Paint, createRect } from "@nativescript-community/ui-canvas";
import { BarChart } from "@nativescript-community/ui-chart";
import { XAxisPosition } from "@nativescript-community/ui-chart/components/XAxis";
import { BarData } from "@nativescript-community/ui-chart/data/BarData";
import { BarDataSet } from "@nativescript-community/ui-chart/data/BarDataSet";
import { CustomRenderer } from "@nativescript-community/ui-chart/renderer/AxisRenderer";
import Vue from "nativescript-vue";

export default Vue.extend({
  data() {
    return {
      nowValues: [0, 41, 0, 0, 42, 0, 0, 0, 0, 0, 0, 0],
      lastValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  },
  computed: {
  },
  methods: {
    onChartLoaded() {
      const chart = (this as any).$refs.chart['nativeView'] as BarChart
      chart.drawGridBackgroundEnabled = false;
      chart.minOffset = 0;
      chart.drawBarShadowEnabled = false;

      const xAxis = chart.xAxis;
      xAxis.drawGridLines = false;
      xAxis.drawLimitLines = false;
      xAxis.drawAxisLine = false;
      xAxis.labelCount = 12;
      xAxis.position = XAxisPosition.BOTTOM;
      xAxis.valueFormatter = {
        /**
         * @param value {number}
         */
        getAxisLabel: (value) => {
          value = Math.ceil(value);
          if (value > 11 || value < 0) {
            return '';
          }
          return value.toString();
        }
      }

      const yAxisCustomRenderer = {
        drawZeroLine(c) {
          const rect = chart.viewPortHandler.chartRect;
          const pos = chart.rendererLeftYAxis.transformer.getPixelForValues(0, 0);
          const paint = new Paint();
          paint.setColor('#F2F2F2');
          let y = pos.y - 2;
          if (y < 0) {
            y = 0;
          }
          const nrect = createRect(rect.left, y, rect.right - rect.left, 2);
          c.drawRect(nrect, paint);
        },
      } satisfies CustomRenderer

      const rightAxis = chart.rightAxis;
      rightAxis.drawGridLines = false;
      rightAxis.drawZeroLine = true;
      rightAxis.drawAxisLine = false;
      rightAxis.drawLimitLines = false;
      rightAxis.drawLabels = false;
      rightAxis.customRenderer = yAxisCustomRenderer;

      const leftAxis = chart.leftAxis;
      leftAxis.drawGridLines = false;
      leftAxis.drawZeroLine = true;
      leftAxis.drawAxisLine = false;
      leftAxis.drawLimitLines = false;
      leftAxis.drawLabels = false;
      leftAxis.customRenderer = yAxisCustomRenderer;

      const nowData = this.nowValues.map((x, i) => ({
        index: i,
        value: x
      }))

      const nowSet = new BarDataSet(nowData, "", 'index', 'value');
      nowSet.color = '#2A85C9';

      const lastData = this.lastValues.map((x, i) => ({
        index: i,
        value: x
      }))

      const lastSet = new BarDataSet(lastData, "", 'index', 'value');
      lastSet.color = '#BEDAEF';

      const chartMax = Math.max(...nowData.map((v) => v.value), ...lastData.map((v) => v.value));
      const chartMin = Math.min(...nowData.map((v) => v.value), ...lastData.map((v) => v.value), 0);
      leftAxis.axisMaximum = chartMax;
      rightAxis.axisMaximum = chartMax;
      leftAxis.axisMinimum = chartMin;
      rightAxis.axisMaximum = chartMin;

      const bd = new BarData([lastSet, nowSet]);
      bd.barWidth = 0.025 * xAxis.labelCount;
      bd.groupBars(0, 1-0.05*xAxis.labelCount, 0, true, false);
      chart.data = bd;

      chart.customRenderer = {
        drawBar(c, e, dataSet, left, top, right, bottom, paint) {
          if (e.value > 0) {
            c.drawRoundRect(left, top, right, bottom, 4, 4, paint)
            c.drawRect(left, top + 4, right, bottom, paint)
          } else if (e.value < 0) {
            c.drawRoundRect(left, top, right, bottom, 4, 4, paint)
            c.drawRect(left, top, right, bottom - 4, paint)
          }
        }
      }
    }
  }
});
</script>

