import { Component, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})

export class MainPageComponent {

  @ViewChild('white_board_iframe')
  whiteBoardIframe!: ElementRef<HTMLIFrameElement>;
  @ViewChild('black_board_iframe')
  blackBoardIframe!: ElementRef<HTMLIFrameElement>;

  gameFinished = false;
  whiteBoardUrl: SafeResourceUrl;
  blackBoardUrl: SafeResourceUrl;
  
  constructor(private sanitizer: DomSanitizer) {
    this.whiteBoardUrl = this.getIframePageUrl(true) 
    this.blackBoardUrl = this.getIframePageUrl()
  }

  ngAfterViewInit() {
    window.addEventListener('message', (event) => {
      if (event.data.mate) {
        this.gameFinished = true;
      }

      const lastTurnColor = event.data.color;

      const targetIframe =
        lastTurnColor === 'white'
          ? this.blackBoardIframe
          : this.whiteBoardIframe;

      const targetWindow = targetIframe.nativeElement.contentWindow;
      if (targetWindow) {
        targetWindow.postMessage(event.data, this.getIframePageUrl());
      }
    });
  }

  onGameEnd() {
    this.gameFinished = true;
  }

  reset() {
    this.gameFinished = false;

    const resetData = { reset: true };

    this.whiteBoardIframe.nativeElement.contentWindow?.postMessage(
      resetData,
      this.whiteBoardUrl
    );

    this.blackBoardIframe.nativeElement.contentWindow?.postMessage(
      resetData,
      this.blackBoardUrl
    );

    localStorage.clear();
  }

  getIframePageUrl(isWhite: boolean = false): SafeResourceUrl {
    const whiteBoardUrl = `${window.location.origin}/iframePage?isWhiteBoard=true`;
    const blackBoardUrl = `${window.location.origin}/iframePage`;

    if (isWhite) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(whiteBoardUrl); 
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl(blackBoardUrl);
    }
  }
}