import { Component, OnInit, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { Video } from '../../models/video.model';
import { VideoPlayerService } from '../../services/video-player.service';

@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {

  @Output() playbackClicked = new EventEmitter();
  private videos: Video[] = [];
  private currentVideo: Video;

  constructor(private videoPlayerService: VideoPlayerService) { }

  ngOnInit() {
    this.videoPlayerService.getApprovedVideos().subscribe(videos => {
      this.videos = videos;

      let videoId = this.videoPlayerService.getLastVisitedVideo();
      if(videoId === 0){
        this.currentVideo = this.videos[0];
      }else{
        this.currentVideo = this.videos.find(v => v.id === videoId);
      }
      this.videoPlayerService.setLastVisitedVideo(this.currentVideo.id);
      
      this.playbackClicked.emit(this.currentVideo);
    });
  }

  ngOnDestroy() {
    this.saveVideos();
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.saveVideos();
    event.returnValue = true;
  }

  launchPlayback(video: Video) {
    this.currentVideo = video;
    this.videoPlayerService.setLastVisitedVideo(this.currentVideo.id);
    this.playbackClicked.emit(this.currentVideo);
  }

  saveVideos() {
    this.videos.forEach((video) => {
      console.log(JSON.stringify(video));
      this.videoPlayerService.updateVideo(video.id, video).subscribe(data => {
      });
    });
  }
}
