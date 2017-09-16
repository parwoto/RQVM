import { Component, ViewContainerRef } from '@angular/core';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { PartsSelectorService } from './partsselector.service';
import { SRSChooserService } from './srschooser.service';
import { QualitiesLoaderService } from './qualitiesloader.service';
import { SRS } from './definitions';
import { Subscription } from 'rxjs/Subscription';
import { ChartSelectEvent } from 'ng2-google-charts';
import { ViewChild } from '@angular/core';
import { Parts } from './definitions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    // Default Title
    title = 'Loading...';
    metaphorTitle = 'Perfect shape of Mountain Fuji';
    chartTitle = 'Document Structure Area';
    srsTitle = 'SRS Document Area';
    tableTitle = 'Quality Table Area';

    pdfSrc: string = '../assets/srs/RQVM.pdf';
    page: number = 1;
    pageurl: SafeResourceUrl;
    fullscreen: boolean = false;

    srssubscription: Subscription;

    chartsubscription: Subscription;
    activeParts: Parts;
    activeSRS: string = 'Not Loaded';
    activeSRSLong: string = 'Not Loaded';

    AISOrgDataTable = [
        ['Name', 'Parent', 'ToolTip'],
        ['Section 3', '', ''],
        ['Subsection 3.1', 'Section 3', ''],
        ['Subsection 3.2', 'Section 3', ''],
        ['Subsection 3.3', 'Section 3', ''],
        ['Subsection 3.4', 'Section 3', ''],
        ['Subsection 3.5', 'Section 3', ''],
        ['Subsection 3.6', 'Section 3', '']
    ];

    LISOrgDataTable = [
        ['Name', 'Parent', 'ToolTip'],
        ['Section 3', '', ''],
        ['Subsection 3.1', 'Section 3', ''],
        ['Subsection 3.2', 'Section 3', ''],
        ['Subsection 3.3', 'Section 3', ''],
        ['Subsection 3.4', 'Section 3', ''],
        ['Subsection 3.5', 'Section 3', ''],
        ['Subsection 3.6', 'Section 3', ''],
        ['Subsection 3.7', 'Section 3', ''],
        ['Subsection 3.8', 'Section 3', ''],
        ['Subsection 3.9', 'Section 3', ''],
        ['Subsection 3.10', 'Section 3', ''],
        ['Subsection 3.11', 'Section 3', ''],
        ['Subsection 3.12', 'Section 3', '']
    ];

    orgChartData = {
        chartType: 'OrgChart',
        dataTable: [['Name', 'Parent', 'ToolTip']],
        options: {
            allowHtml: true,
            allowCollapse: true
        }
    };

    tableChartData: any = {
        chartType: 'Table',
        dataTable: [],
        options: {
            allowHtml: true,
            width: '100%'
        }
    };

    @ViewChild('structurechart') schart;
    @ViewChild('tablechart') tchart;

    constructor(
        private domSanitizer: DomSanitizer,
        private srschosen: SRSChooserService,
        private qualitiesLoaderService: QualitiesLoaderService,
        private partsSelector: PartsSelectorService,
        public viewRef: ViewContainerRef
    ) {
        this.srssubscription = this.srschosen.getSRS().subscribe(srs => {
            console.log('Receiving new srs data on APPComponent');
            this.srsTitle = srs.name;
            this.pdfSrc = srs.pdfSRC;
            this.metaphorTitle = 'Showing overall quality of ' + srs.name;
            this.chartTitle = 'Document Structure of ' + srs.name;

            this.pageurl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);

            if (srs.id === 0) {
                // sets some variables
                this.activeSRS = 'AIS';
                this.activeSRSLong = 'Academic Information System';

                // updating org chart
                this.schart.wrapper.setDataTable(this.AISOrgDataTable);
                console.log('redrawing to show AIS Chart');
                console.log(this.orgChartData.dataTable);
                this.schart.redraw();
                // this.schart.wrapper.getSelection();

                // updating quality table
                console.log('redrawing to update quality table');
                this.tchart.wrapper.setDataTable(qualitiesLoaderService.AISSection3QTable);
                this.tchart.redraw();
            }
            if (srs.id === 1) {
                // sets some variables
                this.activeSRS = 'LIS';
                this.activeSRSLong = 'Library Information System';

                // updating org chart
                this.schart.wrapper.setDataTable(this.LISOrgDataTable);
                console.log('redrawing to update LIS Chart');
                console.log(this.orgChartData.dataTable);
                this.schart.redraw();
                //this.schart.wrapper.getSelection();

                // updating quality table
                console.log('redrawing to update quality table');
                this.tchart.wrapper.setDataTable(qualitiesLoaderService.LISSection3QTable);
                this.tchart.redraw();
            }
        });

        this.chartsubscription = this.partsSelector.getParts().subscribe(chartName => {

        });
    }

    public select(event: ChartSelectEvent) {
        this.metaphorTitle = 'Showing quality of ' + event.selectedRowValues[0] + ' of SRS of ' + this.activeSRSLong;
        let qualitySelector = this.selectQualityByName(event.selectedRowValues[0]);
        let labelSelector = this.selectLabelByName(event.selectedRowValues[0]);
        this.activeParts = {
            name: event.selectedRowValues[0],
            quality: qualitySelector,
            label: labelSelector
        };
        this.partsSelector.setParts(this.activeParts);

        let qTableSelector = this.selectQTableByName(event.selectedRowValues[0]);
        this.tchart.wrapper.setDataTable(qTableSelector);
        this.tchart.redraw(); 
    }

    selectQualityByName(partsName) {
        let qualityName: string;

        if (partsName == 'Overall') {
            partsName = 'Section 3'
        }
        qualityName = this.activeSRS + partsName.replace(" ", "").replace(".", "");

        return eval('this.qualitiesLoaderService.' + qualityName);
    }

    selectLabelByName(partsName) {
        let labelName: string;

        if (partsName == 'Overall') {
            partsName = 'Section 3'
        }
        labelName = this.activeSRS + partsName.replace(" ", "").replace(".", "") + 'Labels';

        return eval('this.qualitiesLoaderService.' + labelName);
    }
    
    selectQTableByName(partsName) {
        let labelName: string;

        if (partsName == 'Overall') {
            partsName = 'Section 3'
        }
        labelName = this.activeSRS + partsName.replace(" ", "").replace(".", "") + 'QTable';

        return eval('this.qualitiesLoaderService.' + labelName);
    }

    public getChart() {
        return this.schart;
    }

    ngOnInit() {
        this.pageurl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);

        // setting height for metaphor area
        document.getElementById("metaphor").style.height = (window.innerHeight - 28 * 3 - 150 - 20).toString() + "px"; // (panel_header*3 - insetsarea - footer)

        // setting height for chart area
        document.getElementById("chart-area").style.height = (183 - 33).toString() + "px"; // (panel_header*3 - insetsarea - footer)

        // setting size for pdf area
        document.getElementById("pdfarea").style.width = (window.innerWidth / 2 - 5).toString() + "px";
        document.getElementById("pdfarea").style.height = (window.innerHeight - 28 * 3 - 150 - 20).toString() + "px"; // (panel_header*3 - insetsarea - footer)
        document.getElementById("toggle-fullscreen").addEventListener('click', _ => this.toggleFullscreen());
    }

    toggleFullscreen() {
        if (!this.fullscreen) {
            document.getElementById("panel-metaphor").classList.add('panel-fullscreen');
            document.getElementById("metaphor").style.height = window.innerHeight.toString() + "px"; // (panel_header*3 - insetsarea - footer)
            console.log("panel-body---------->" + window.innerHeight);
            this.fullscreen = true;
        }
        else {
            document.getElementById("panel-metaphor").classList.remove('panel-fullscreen');
            document.getElementById("metaphor").style.height = (window.innerHeight - 28 * 3 - 150 - 20).toString() + "px"; // (panel_header*3 - insetsarea - footer)
            this.fullscreen = false;
        }
    }
}