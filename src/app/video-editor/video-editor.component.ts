import { Component, OnInit } from '@angular/core';
import { VideoPlayerService } from '../services/video-player.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Video } from '../models/video.model';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

const MESSAGE = {
  ADD_SUCCESSFUL : "A video has been successfully added!",
  EDIT_SUCCESSFUL : "A video has been successfully updated!",
  DELETE_SUCCESSFUL : "A video has been successfully deleted!",
  APPROVE_SUCCESSFUL : "A video has been successfully approved!",
};

@Component({
  selector: 'app-video-editor',
  templateUrl: './video-editor.component.html',
  styleUrls: ['./video-editor.component.scss']
})
export class VideoEditorComponent implements OnInit {

  private videos: Video[];
  private selectedVideo: Video;
  successMessage: string;
  private _success = new Subject<string>();

  private videoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    url: new FormControl('http://', [
      Validators.required,
      Validators.pattern(/https?:\/\/\w+/),
    ]),
  });

  constructor(
    private videoPlayerService: VideoPlayerService,
    private modalService: NgbModal,
    private config: NgbModalConfig) { 

      config.backdrop = 'static';
      config.keyboard = false;
  }

  ngOnInit() {
    this.loadVideos();

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(3000)
    ).subscribe(() => this.successMessage = null);
  }

  loadVideos() {
    this.videoPlayerService.getVideos().subscribe(videos => {
      this.videos = videos;
    });
  }

  save() {
    let video: Video = {
      "id": 0,
      "title": "",
      "url": "",
      "duration": "00:00:00",
      "approved": false,
      "likes": 0,
      "unlikes": 0,
      "playedtime": 0
    };
    let nextId = this.getNextId();
    if(this.selectedVideo){
      this.selectedVideo = { ...this.selectedVideo, ...this.videoForm.value};
      this.selectedVideo.approved = false;
      this.videoPlayerService.updateVideo(this.selectedVideo.id, this.selectedVideo).subscribe(
        res => {
          this.loadVideos();
          this.resetForm();
          this._success.next(MESSAGE.EDIT_SUCCESSFUL);
        },
        error => {
          this.resetForm();
          console.error(error);
        });
    }else{
      video = { ...{id: nextId}, ...video, ...this.videoForm.value};
      this.videoPlayerService.addVideo(video).subscribe(
        res => {
          this.loadVideos();
          this.resetForm();
          this._success.next(MESSAGE.ADD_SUCCESSFUL);
        },
        error => {
          this.resetForm();
          console.error(error);
        });
    }
    console.log(video);
  }

  resetForm() {
    this.selectedVideo = null;
    this.videoForm.reset({title: '', url: 'http://'}); 
  }

  edit(video: Video){
    this.selectedVideo = video;
    this.videoForm.setValue({title: video.title, url: video.url}); 
  }

  delete(content: any, video: Video){
    this.modalService.open(content, { centered: true }).result.then(
      () => {
        this.videoPlayerService.deleteVideo(video.id).subscribe(
          res => {
            console.log(res);

            const idx = this.videos.findIndex(c => c.id === video.id);
            this.videos.splice(idx, 1);

            this._success.next(MESSAGE.DELETE_SUCCESSFUL);
          },
          error => {
            console.error(error);
          }
        );
      },
      f => f
    );
  }

  approve(video: Video){
    video.approved = true;
    this.videoPlayerService.approveVideo(video.id).subscribe(
      res => {
        this._success.next(MESSAGE.APPROVE_SUCCESSFUL);
      },
      error => {
        video.approved = false;
        console.error(error);
      }
    );
  }

  getNextId(): number {
    let nextId: number = 0;
    this.videos.forEach((video) => {
      if(video.id > nextId){
        nextId = video.id;
      }
    });
    return ++nextId;
  }
}
