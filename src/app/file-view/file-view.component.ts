import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GcPdfViewer } from '@grapecity/gcpdfviewer';
import { flashAnimation } from 'angular-animations';
import { LinkAnnotationService, BookmarkViewService, MagnificationService,
  ThumbnailViewService, ToolbarService, NavigationService,
  AnnotationService, TextSearchService, TextSelectionService,
  PrintService
} from '@syncfusion/ej2-angular-pdfviewer';


@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  template: `<div class="content-wrapper">
  <ejs-pdfviewer id="pdfViewer" [serviceUrl]='service' [documentPath]='document' style="height:640px;display:block"></ejs-pdfviewer>
</div>`,
  styleUrls: ['./file-view.component.css'],
  providers: [ LinkAnnotationService, BookmarkViewService, MagnificationService,
    ThumbnailViewService, ToolbarService, NavigationService,
    AnnotationService, TextSearchService, TextSelectionService,
    PrintService]
})
export class FileViewComponent implements OnInit{



constructor(@Inject(MAT_DIALOG_DATA) public data:any,private route:Router){}

fileName:string="";
location:string="";
  ngOnInit(): void {
  this.fileName=this.data.id;
 this.location="/myfiles"+"/"+this.fileName
 this.viewAfter(this.fileName)

  }

  // @HostListener('document:click',['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   const targetElement = event.target as HTMLElement;
  //   // Check if the click event originated from within the popup component
  //   if (targetElement&& !targetElement.closest('.popup')) {
  //     this.isVisible = false;
  //   }
  // }

//View PDF
 
viewAfter(serial :string){
  const viewer = new GcPdfViewer("#viewer", {
    workerSrc: "//cdn.jsdelivr.net/npm/@grapecity/gcpdfviewer@3.0.0/gcpdfviewer.worker.js",
   // workerSrc: "//node_modules/@grapecity/gcpdfviewer/gcpdfviewer.worker.js",
    restoreViewStateOnLoad: false
  });
  viewer.addDefaultPanels();
   console.log("file Name "+ serial)
  // viewer.open("https://raw.githubusercontent.com/Zuke99/zrcRep/master/src/uploads/"+serial)
  const pdfUrl = "https://raw.githubusercontent.com/Zuke99/zrcRep/master/src/uploads/1687709814058.pdf"; // Replace with your PDF file URL
  
  // Generate the <iframe> element dynamically
  const iframe = document.createElement("iframe");
  iframe.src = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  iframe.width = "100%";
  iframe.height = "100%";
  
  // Append the <iframe> to the viewer element
  const viewerElement = document.querySelector("#viewer");
  if (viewerElement) {
    viewerElement.innerHTML = "";
    viewerElement.appendChild(iframe);
  } else {
    console.error("Viewer element not found.");
  }

}
  
close(){
  console.log("close")
  window.location.reload();
}
  
}
