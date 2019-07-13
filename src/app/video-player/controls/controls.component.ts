
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { VideoPlayerService } from '../../services/video-player.service';
import { Video } from '../../models/video.model';

@Component({
  selector: 'controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  @Input() muted = false;
  @Input() paused = true;
  @Input() volume: number;
  @Output() playClicked = new EventEmitter();
  @Output() pauseClicked = new EventEmitter();
  @Output() stopClicked = new EventEmitter();
  @Output() reloadClicked = new EventEmitter();
  @Output() tgMuteClicked = new EventEmitter();
  @Output() volClicked = new EventEmitter();
  @Output() volSelected = new EventEmitter();
  @Output() progressClicked = new EventEmitter();

  @ViewChild('progressBar', { static: true }) progressBarRef: ElementRef;
  

  private _currentTime = 0;
  private _duration = 0;
  private _currentVideo: Video;
  private durationLabel: string;
  private currentTimeLabel: string;
  private ratio: number;
  private liked = false;
  private unliked = false;

  constructor(private videoPlayerService: VideoPlayerService) {

  }

  ngOnInit() {
  }

  play() {
    this.playClicked.emit();
  }

  pause() {
    this.pauseClicked.emit();
  }

  stop() {
    this.stopClicked.emit();
  }

  reload() {
    this.reloadClicked.emit();
  }

  changeVolume(amount: number) {
    this.volClicked.emit(amount);
  }

  setVolume(volume: number) {
    this.volSelected.emit(volume);
  }

  toggleMute() {
    this.tgMuteClicked.emit();
  }

  like() {
    this.liked = !this.liked;
    if(this.liked){
      ++this.currentVideo.likes;
    }else{
      --this.currentVideo.likes;
    }
    
  }

  unlike() {
    this.unliked = !this.unliked;
    if(this.unliked){
      ++this.currentVideo.unlikes;
    }else{
      --this.currentVideo.unlikes;
    }
  }

  @Input()
  set currentTime(currentTime: number) {
    this._currentTime = currentTime;
    this.currentTimeLabel = this.videoPlayerService.secondsToTimeString(this._currentTime);
    this.resetRatio();
  }

  @Input()
  set duration(duration: number) {
    this._duration = duration;
    this.durationLabel = this.videoPlayerService.secondsToTimeString(this._duration);
    this.resetRatio();
  }

  @Input() 
  set currentVideo(currentVideo: Video){
    this._currentVideo = currentVideo;
    this.liked = false;
    this.unliked = false;
  }

  get currentVideo(): Video{
    return this._currentVideo;
  }

  resetRatio() {
    if (this._duration) {
      this.ratio = this._currentTime / this._duration;
    } else {
      this.ratio = 0;
    }
  }

  get duration(): number {
    return this._duration;
  }

  get currentTime(): number {
    return this._currentTime;
  }

  seek(event: object) {
    this.currentTime = event['offsetX'] / this.progressBarRef.nativeElement['offsetWidth'] * this._duration;
    this.progressClicked.emit(this._currentTime);
  }
}
