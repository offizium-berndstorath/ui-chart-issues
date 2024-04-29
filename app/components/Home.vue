<template>
  <Page>
    <GridLayout height="100%" rows="auto, 125" columns="42, *, 42" backgroundColor="#F2F2F2">
      <BarChart row="1" col="1" ref="chart" @loaded="onChartLoaded" height="100%" width="100%" />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { Canvas, Paint, createRect } from "@nativescript-community/ui-canvas";
import { BarChart } from "@nativescript-community/ui-chart";
import { XAxisPosition } from "@nativescript-community/ui-chart/components/XAxis";
import { BarData } from "@nativescript-community/ui-chart/data/BarData";
import { BarDataSet } from "@nativescript-community/ui-chart/data/BarDataSet";
import Vue from "nativescript-vue";

export default Vue.extend({
  data() {
    return {
      nowValues: [-18.17,-18.405,-18.5,-17.175,-16.66,-18.405,-9.275,0,0,0,0,0],
      lastValues: [-18.45,-18.36,-17.685000000000002,-18.4,-18.275,-18.11,-16.875,-15.850000000000001,-17.535,-18.65,-18.16,-18.665]
    }
  },
  computed: {
  },
  methods: {
    onChartLoaded() {
      const chart = (this.$refs as any).chart['nativeView'] as BarChart;
      chart.drawGridBackgroundEnabled = false;
      chart.minOffset = 0;
      chart.drawBarShadowEnabled = false;

      const xAxis = chart.xAxis;
      xAxis.drawGridLines = true;
      xAxis.drawLimitLines = false;
      xAxis.drawAxisLine = false;
      xAxis.labelCount = 12;
      xAxis.position = XAxisPosition.BOTTOM;
      xAxis.valueFormatter = {
        getAxisLabel: (value: number) => {
          value = Math.ceil(value);
          if (value > 11 || value < 0) {
            return '';
          }
          return (value * 2).toString()
        }
      }

      const rightAxis = chart.rightAxis;
      rightAxis.drawGridLines = false;
      rightAxis.drawZeroLine = false;
      rightAxis.drawAxisLine = false;
      rightAxis.drawLimitLines = false;
      rightAxis.drawLabels = false;
      rightAxis.zeroLineWidth = 200;
      rightAxis.zeroLineColor = '#F2F2F2'

      const leftAxis = chart.leftAxis;
      leftAxis.drawGridLines = false;
      leftAxis.drawZeroLine = false;
      leftAxis.drawAxisLine = false;
      leftAxis.drawLimitLines = false;
      leftAxis.drawLabels = false;
      rightAxis.zeroLineWidth = 200;
      rightAxis.zeroLineColor = '#F2F2F2'

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
      const chartMin = Math.min(...nowData.map((v) => v.value), ...lastData.map((v) => v.value));
      leftAxis.axisMaximum = chartMax;
      rightAxis.axisMaximum = chartMax;
      leftAxis.axisMinimum = chartMin;
      rightAxis.axisMaximum = chartMin;

      const bd = new BarData([lastSet, nowSet]);
      bd.barWidth = 0.025 * xAxis.labelCount;
      bd.groupBars(0, 0.35, 0, true, true);
      chart.data = bd;
      const self = this;
      chart.customRenderer = {
        drawBar(c, e, dataSet, left, top, right, bottom, paint) {
          if (e.value > 0) {
            c.drawRoundRect(left, top, right, bottom, 4, 4, paint)
            c.drawRect(left, top + 4, right, bottom, paint)
          } else {
            c.drawRoundRect(left, top, right, bottom, 4, 4, paint)
            c.drawRect(left, top, right, bottom - 4, paint)
          }
          self.drawZeroLine(chart, c);
        }
      }
    },
    drawZeroLine(chart: BarChart, canvas: Canvas) {
      const rect = chart.viewPortHandler.chartRect;
      const pos = chart.rendererLeftYAxis.transformer.getPixelForValues(0, 0);
      const paint = new Paint();
      paint.setColor('#F2F2F2');
      let y = pos.y - 2;
      if (y < 0) {
        y = 0;
      }
      const nrect = createRect(rect.left, y, rect.right - rect.left, 2);
      canvas.drawRect(nrect, paint);
    }
  }
});
</script>

