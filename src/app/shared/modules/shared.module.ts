import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [BrowserModule, CommonModule],
  exports: [BrowserModule, CommonModule],
})
export class SharedModule {}