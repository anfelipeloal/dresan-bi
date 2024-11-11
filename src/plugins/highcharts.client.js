import ExportingModule from 'highcharts/modules/exporting';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import MapsModule from 'highcharts/modules/map';
import DrilldownModule from 'highcharts/modules/drilldown';
import accessibility from 'highcharts/modules/accessibility';
import highchartsMore from 'highcharts/highcharts-more';
import solidGauge from 'highcharts/modules/solid-gauge';
// import StockModule from "highcharts/modules/stock";

export default defineNuxtPlugin((nuxtApp) => {
    // StockModule(Highcharts);
    MapsModule(Highcharts);
    ExportingModule(Highcharts);
    DrilldownModule(Highcharts);
    nuxtApp.vueApp.use(HighchartsVue);

    accessibility(Highcharts);
    highchartsMore(Highcharts);
    solidGauge(Highcharts);

    const { colors } = Highcharts.getOptions();
    const opacityColors = Highcharts.getOptions().colors.map((color) => new Highcharts.Color(color).setOpacity(0.3).get());

    return {
        provide: {
            charts: {
                colors,
                opacityColors,
            },
        },
    };
});
