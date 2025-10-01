import { Component, Input, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'app-iebem-date-picker',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './date-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Seleccionar fecha';
  @Input() disabled = false;
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() id = '';
  @Input() clearable = true;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;

  @ViewChild('calendarContainer') calendarContainer!: ElementRef;

  selectedDate: Date | null = null;
  isOpen = false;
  touched = false;
  displayValue = '';
  currentView: 'days' | 'months' | 'years' = 'days';
  calendarLeft = 0;
  calendarTop = 0;
  calendarVisible = false;
  overlayVisible = false;
  
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  startYear = new Date().getFullYear() - 12;
  endYear = new Date().getFullYear() + 12;

  daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  calendarDays: any[] = [];
  yearRange: number[] = [];

  private onChangeCallback = (value: any) => {};
  private onTouchedCallback = () => {};

  ngOnInit(): void {
    if (!this.id) this.id = `iebem-dp-${Math.random().toString(36).slice(2, 9)}`;
    this.generateCalendar();
    this.generateYearRange();
    this.updateDisplayValue();
  }

  get showError(): boolean {
    const hasExternalError = !!(this.error && this.error.trim());
    const isEmpty = !this.selectedDate;
    return hasExternalError || (this.required && isEmpty && this.touched);
  }

  get inputClasses(): string {
    const variant = this.showError ? 'input-error' : 'input-default';
    const padding = 'py-3 pl-4 pr-10 cursor-pointer';
    const disabled = this.disabled ? 'input-disabled' : '';
    return [variant, padding, disabled].filter(Boolean).join(' ');
  }

  updateDisplayValue(): void {
    this.displayValue = this.selectedDate ? this.formatDate(this.selectedDate) : '';
  }

  toggleCalendar(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.disabled) return;
    if (!this.isOpen) {
      this.isOpen = true;
      this.currentView = 'days';
      this.generateCalendar();
      this.calculateCalendarPosition();
      this.overlayVisible = false;
      this.calendarVisible = false;
      setTimeout(() => { this.overlayVisible = true; this.calendarVisible = true; }, 10);
    } else {
      this.closeCalendar();
    }
  }

  private calculateCalendarPosition(): void {
    const calendarWidth = 320;
    const calendarHeight = 400;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    this.calendarLeft = Math.max(0, (viewportWidth - calendarWidth) / 2);
    this.calendarTop = Math.max(0, (viewportHeight - calendarHeight) / 2);
  }

  closeCalendar(): void {
    this.overlayVisible = false;
    this.calendarVisible = false;
    setTimeout(() => { this.isOpen = false; }, 200);
    this.touched = true;
    this.onTouchedCallback();
  }

  selectToday(): void {
    const today = new Date();
    this.selectAndEmit(today);
  }

  clearDate(): void {
    if (!this.clearable) return;
    this.selectedDate = null;
    this.updateDisplayValue();
    this.onChangeCallback(null);
  }

  selectDate(day: any): void {
    if (!day.isCurrentMonth || day.isOutOfRange) return;
    const date = new Date(this.currentYear, this.currentMonth, day.number);
    this.selectAndEmit(date);
  }

  private selectAndEmit(date: Date): void {
    this.selectedDate = date;
    this.updateDisplayValue();
    this.onChangeCallback(this.selectedDate);
  }

  getMonthName(): string { return this.monthNames[this.currentMonth]; }
  previousMonth(): void { if (--this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; } this.generateCalendar(); }
  nextMonth(): void { if (++this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; } this.generateCalendar(); }
  showMonthPicker(): void { this.currentView = 'months'; }
  showYearPicker(): void { this.currentView = 'years'; this.generateYearRange(); }
  showDayPicker(): void { this.currentView = 'days'; this.generateCalendar(); }
  selectMonth(i: number): void { this.currentMonth = i; this.showDayPicker(); }
  selectYear(year: number): void { this.currentYear = year; this.showDayPicker(); }
  previousYearRange(): void { this.startYear -= 24; this.endYear -= 24; this.generateYearRange(); }
  nextYearRange(): void { this.startYear += 24; this.endYear += 24; this.generateYearRange(); }

  generateYearRange(): void { this.yearRange = Array.from({ length: this.endYear - this.startYear + 1 }, (_, i) => this.startYear + i); }
  generateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();

    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
    const days: any[] = [];
    for (let i = startDay - 1; i >= 0; i--) { days.push({ number: prevMonthLastDay - i, isCurrentMonth: false }); }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      const isOutOfRange = (this.minDate && date < this.minDate) || (this.maxDate && date > this.maxDate);
      days.push({ number: i, isCurrentMonth: true, isOutOfRange });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) { days.push({ number: i, isCurrentMonth: false }); }
    this.calendarDays = days;
  }

  getDayClasses(day: any): string {
    const base = 'w-10 h-10 flex items-center justify-center rounded-lg text-sm transition-colors';
    const muted = day.isCurrentMonth ? '' : ' text-gray-300';
    const disabled = day.isOutOfRange ? ' opacity-50 cursor-not-allowed' : ' hover:bg-iebem-light hover:bg-opacity-60';
    const selected = this.selectedDate && day.isCurrentMonth && this.selectedDate.getDate() === day.number ? ' bg-iebem-primary text-white' : '';
    return base + muted + disabled + selected;
  }

  getMonthClasses(i: number): string {
    const base = 'px-3 py-2 rounded-lg text-sm hover:bg-iebem-light hover:bg-opacity-60';
    const active = i === this.currentMonth ? ' bg-iebem-primary text-white' : '';
    return base + active;
  }

  getYearClasses(year: number): string {
    const base = 'px-3 py-2 rounded-lg text-sm hover:bg-iebem-light hover:bg-opacity-60';
    const active = year === this.currentYear ? ' bg-iebem-primary text-white' : '';
    return base + active;
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // CVA
  writeValue(value: any): void {
    if (value instanceof Date) {
      this.selectedDate = value;
    } else if (typeof value === 'string' && value) {
      const parts = value.split(/[\/-]/);
      if (parts.length >= 3) {
        const [d, m, y] = parts.map(Number);
        if (!isNaN(d) && !isNaN(m) && !isNaN(y)) this.selectedDate = new Date(y, m - 1, d);
      }
    } else {
      this.selectedDate = null;
    }
    this.updateDisplayValue();
  }
  registerOnChange(fn: (value: any) => void): void { this.onChangeCallback = fn; }
  registerOnTouched(fn: () => void): void { this.onTouchedCallback = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
}
