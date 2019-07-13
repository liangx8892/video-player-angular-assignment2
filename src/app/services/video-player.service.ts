import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video } from '../models/video.model'

const LOCAL_STORAGE_KEYS = {
  LAST_VISITED_VIDEO: 'lastVisitedVideo'
};

@Injectable()
export class VideoPlayerService {

  constructor(private http: HttpClient) {
    
  }

  getVideos() {
    return this.http.get<Video[]>('/videos?_sort=id&_order=asc');
  }

  getApprovedVideos() {
    return this.http.get<Video[]>('/videos?approved=true&_sort=id&_order=asc');
  }

  updateVideo(id: number, video: Video) {
    return this.http.put<any>(`/videos/${id}`, video);
  }

  addVideo(video: Video) {
    video.approved = false;
    return this.http.post('/videos', video);
  }

  approveVideo(id: number) {
    return this.http.patch(`/videos/${id}`, { approved: true });
  }

  deleteVideo(id: number) {
    return this.http.delete(`/videos/${id}`);
  }

  secondsToTimeString(seconds: number) {
    if (isNaN(seconds)) {
      seconds = 0;
    }
    let sec_num = Math.floor(seconds);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    sec_num = sec_num - (hours * 3600) - (minutes * 60);
    let hoursString = hours.toString();
    let minutesString = minutes.toString();
    let secondsString = sec_num.toString();
    if (hours < 10) { hoursString = "0" + hours; }
    if (minutes < 10) { minutesString = "0" + minutes; }
    if (sec_num < 10) { secondsString = "0" + sec_num; }
    return hoursString + ':' + minutesString + ':' + secondsString;
  }

  setLastVisitedVideo(id: number) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_VISITED_VIDEO, id.toString());
  }

  getLastVisitedVideo(): number {
    let idString = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_VISITED_VIDEO);
    if(idString){
      return parseInt(idString);
    }
    return 0;
  }
}
