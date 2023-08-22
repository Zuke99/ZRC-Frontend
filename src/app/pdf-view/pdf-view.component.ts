import { Component, OnInit } from '@angular/core';
import { DownloadEndEventArgs } from '@syncfusion/ej2-angular-pdfviewer';
import { DownloadfileService } from '../downloadfile.service';
import GcPdfViewer from '@grapecity/gcpdfviewer';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css']
})
export class PdfViewComponent implements OnInit{
constructor(private service:DownloadfileService){}
fileName:any
ngOnInit(): void {
  this.fileName=this.service.getFileName()
  this.viewAfter(this.fileName)
}
viewAfter(serial :any){
  const viewer = new GcPdfViewer("#viewer", {
    workerSrc: "//node_modules/@grapecity/gcpdfviewer/gcpdfviewer.worker.js",
    restoreViewStateOnLoad: false
  });
  viewer.addDefaultPanels();
  viewer.open("myfiles"+"/"+serial)

}


}
