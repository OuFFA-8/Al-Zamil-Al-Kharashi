import { Component, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, MapMarker, GoogleMapsModule } from '@angular/google-maps'; 
import { TranslatePipe } from '@ngx-translate/core';

interface Branch {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

@Component({
  selector: 'app-branch-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, TranslatePipe], 
  templateUrl: './branch-map.component.html',
  styleUrls: ['./branch-map.component.css']
})
export class BranchMapComponent {
  @ViewChild(GoogleMap) map: GoogleMap | undefined; 

  readonly branches = signal<Branch[]>([
     { id: 1, name: 'الفرع الرئيسي - الرياض', lat: 24.692264, lng: 46.719487, address: 'طريق مكة المكرمة ، جسر الخليج' },
     { id: 2, name: 'فرع الشرقية : الخبر​', lat: 26.340197, lng: 50.198730, address: 'طريق الملك فهد ، برج NSH' },
     { id: 3, name: 'فرع الغربية : جدة​', lat: 21.602424, lng: 39.108295, address: 'برج ذا هيد كوارتز بزنس بارك' }
   ]);

  mapOptions: google.maps.MapOptions = {
    center: { lat: 24.5, lng: 45 },
    zoom: 6,
    mapTypeControl: false,
    streetViewControl: false, 
    fullscreenControl: false 
  };

  markerOptions: google.maps.MarkerOptions = {
  };

  constructor() {}

  goToBranch(branchId: number): void {
    const branch = this.branches().find(b => b.id === branchId);
    if (branch && this.map?.googleMap) { 
      const newCenter = { lat: branch.lat, lng: branch.lng };
      this.map.googleMap.panTo(newCenter); 
      this.map.googleMap.setZoom(15); 
    }
  }
}