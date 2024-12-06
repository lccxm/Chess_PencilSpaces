import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  
import {NgxChessBoardView} from 'ngx-chess-board';
import { HistoryMove } from 'ngx-chess-board/lib/history-move-provider/history-move';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css']
})
export class ChessComponent implements OnInit {

  isWhiteBoard: boolean = false


  @Input() onGameEnd!: () => void;

  constructor(private route: ActivatedRoute) { }

  @ViewChild('board', {static: false}) board!: NgxChessBoardView;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);
      this.isWhiteBoard = params['isWhiteBoard'] ?? false;  
    });

    window.addEventListener('message', (event) => {
      if (event.data.reset) {
        this.handleResetEvent();
      } else {
        this.handleMoveEvent(event.data);
      }
    });
  }

  onMove() {
    const lastMove = this.board.getMoveHistory().slice(-1)[0];
    window.parent.postMessage(lastMove, this.getMainPageUrl());
  }

  ngAfterViewInit() {

    const currBoardState = localStorage.getItem('board');
    if (currBoardState) {
      this.board.setFEN(currBoardState);
    }

    if (!this.isWhiteBoard) {
      this.board.reverse()
    }
  }

    private handleResetEvent() {
      this.board.reset();
  
      if (!this.isWhiteBoard) {
        this.board.reverse();
      }
  
      localStorage.clear();
    }

    private handleMoveEvent(moveData: HistoryMove) {
      this.board.move(moveData.move);
      localStorage.setItem('board', this.board.getFEN());
  
      if (moveData.mate) {
        this.onGameEnd();
      }
    }
  
    private getMainPageUrl(): SafeResourceUrl {
      return `${window.location.origin}/mainPage`;
    }
 
}
