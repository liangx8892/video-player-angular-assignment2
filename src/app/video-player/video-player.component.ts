import { Component, OnInit, ViewChild } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { ControlsComponent } from './controls/controls.component';
import { interval } from 'rxjs';
import { Video } from '../models/video.model';
import { VideoPlayerService } from '../services/video-player.service';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  private source = interval(10);

  private currentTime: number;
  private duration: number;
  private currentVideo: Video;

  @ViewChild(PlayerComponent, { static: true })
  playerComponent: PlayerComponent;

  @ViewChild(ControlsComponent, { static: true })
  controlsComponent: ControlsComponent;

  constructor(private videoPlayerService: VideoPlayerService) { }

  ngOnInit() {
    this.source.subscribe(this.onCurrentTimeUpdate.bind(this));
  }




  get video() {
    return this.playerComponent.videoRef.nativeElement;
  }

  play() {
    this.video.play();
  }

  pause() {
    this.video.pause();
  }

  stop() {
    this.video.pause();
    this.video.currentTime = 0;
  }

  reload() {
    this.video.src = this.currentVideo.url;
    this.video.load();
    this.video.play();
  }

  toggleMute() {
    this.video.muted = !this.video.muted;
  }

  changeVolume(amount: number) {
    const currentVolume = this.video.volume;
    let targetVolume = currentVolume + amount;
    if (targetVolume > 1) {
      targetVolume = 1;
    } else if (targetVolume < 0) {
      targetVolume = 0;
    }
    this.video.volume = targetVolume;
  }

  setVolume(volume: number) {
    this.video.volume = volume / 100;
  }

  onDurationUpdate(duration: number) {
    this.duration = duration;
  }

  onCurrentTimeUpdate() {
    this.currentTime = this.video.currentTime;
    this.duration = this.video.duration;
    //save progress of previous video
    if (this.currentVideo) {
      this.currentVideo.playedtime = this.video.currentTime;
    }
  }

  seek(currentTime: number) {
    this.video.currentTime = currentTime;
  }

  setCurrentVideo(video: Video) {
    //launch selected video
    this.currentVideo = video;
    this.launchPlayback();
  }

  launchPlayback() {
    this.video.src = this.currentVideo.url + "#t=" + this.currentVideo.playedtime;
  }

  onEnded() {
    this.video.src = this.currentVideo.url;
  }
}
