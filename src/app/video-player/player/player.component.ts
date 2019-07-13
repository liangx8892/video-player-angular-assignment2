import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Output() durationUpdate = new EventEmitter();
  @Output() ended = new EventEmitter();
  

  @ViewChild('video', { static: true }) videoRef: ElementRef;
  constructor() { }

  ngOnInit() {

  }

  get video() {
    return this.videoRef.nativeElement;
  }

  onEnded() {
    this.video.load();
    this.ended.emit();
  }

  onCanPlay() {
    this.durationUpdate.emit(this.video.duration);
  }

}
