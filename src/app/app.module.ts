import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { PlayerComponent } from './video-player/player/player.component';
import { ControlsComponent } from './video-player/controls/controls.component';
import { PlaylistComponent } from './video-player/playlist/playlist.component';
import { VideoPlayerService } from './services/video-player.service';
import { HttpClientModule, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RestInterceptor } from './interceptors/rest.interceptor';
import { RouterModule, Routes } from '@angular/router';
import { VideoEditorComponent } from './video-editor/video-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  { path: 'play', component: VideoPlayerComponent },
  { path: 'edit', component: VideoEditorComponent },
  { path: '',
    redirectTo: '/play',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    VideoPlayerComponent,
    PlayerComponent,
    ControlsComponent,
    PlaylistComponent,
    VideoEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    VideoPlayerService,
    NgbModal,
    { provide: HTTP_INTERCEPTORS, useClass: RestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
