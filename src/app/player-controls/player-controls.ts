import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MusicStateService } from '../services/music-state';
import { Track } from '../models/track.models';

@Component({
  selector: 'app-player-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-controls.html',
  styleUrls: ['./player-controls.css']
})
export class PlayerControlsComponent implements OnInit, OnDestroy {
  currentTrack: Track | null = null;
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 80;
  audio: HTMLAudioElement = new Audio();  // Creamos el objeto de Audio

  private subscription?: Subscription;

  constructor(private musicState: MusicStateService) {}

  ngOnInit(): void {
    // Suscribirse a la pista actual
    this.subscription = this.musicState.currentTrack$.subscribe(track => {
      this.currentTrack = track;
      if (track) {
        this.duration = track.duration;

        // Verificar si la URL de vista previa está disponible
        if (track.previewUrl) {
          this.audio.src = track.previewUrl; // URL de la canción
          this.audio.load(); // Cargar el archivo de audio
          this.audio.volume = this.volume / 100; // Establecer el volumen
        } else {
          console.error("Error: La URL de la canción (previewUrl) no está disponible.");
          // Aquí podrías manejar la situación de que no haya una URL de vista previa
        }
      }
    });
  }

  // Alternar entre reproducir y pausar
  togglePlay(): void {
    if (this.isPlaying) {
      this.audio.pause(); // Pausar la música
    } else {
      this.audio.play(); // Reproducir la música
    }
    this.isPlaying = !this.isPlaying;
  }

  // Cambiar a la canción anterior (a implementar)
  previous(): void {
    console.log('⏮Anterior');
    // Aquí implementa la lógica para la canción anterior
  }

  // Cambiar a la siguiente canción (a implementar)
  next(): void {
    console.log('⏭ Siguiente');
    // Aquí implementa la lógica para la siguiente canción
  }

  // Cambiar el tiempo de la canción (mover la barra de progreso)
  seek(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.currentTime = parseInt(input.value);
    this.audio.currentTime = this.currentTime; // Cambiar la posición de reproducción
    console.log('⏱️ Seek to:', this.currentTime);
  }

  // Cambiar el volumen
  changeVolume(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.volume = parseInt(input.value);
    this.audio.volume = this.volume / 100; // Ajustar el volumen
    console.log('🔊 Volumen:', this.volume);
  }

  // Formatear el tiempo en formato "mm:ss"
  formatTime(ms: number): string {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Limpiar la suscripción cuando el componente se destruya
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.audio.pause(); // Asegurarse de que la música se detenga cuando se destruya el componente
  }
}
