import { Component, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    this.generateCalendar();
    this.generateYearRange();
    this.updateDisplayValue();
  }

  get inputClasses(): string {
    // Usar exactamente las mismas clases que InputComponent
    const baseClasses = 'block w-full rounded-xl !border-0 shadow-sm ring-1 ring-inset transition-all duration-200 focus:ring-2 focus:ring-inset focus:outline-none text-gray-900 placeholder:text-gray-400 !py-3 !px-4 !pr-10 cursor-pointer';
    
    let stateClasses = '';
    if (this.error) {
      stateClasses = 'ring-red-300 focus:ring-red-500 bg-red-50';
    } else if (this.isOpen) {
      stateClasses = 'ring-iebem-primary focus:ring-iebem-primary bg-white';
    } else {
      stateClasses = 'ring-gray-300 focus:ring-iebem-primary bg-white hover:ring-gray-400';
    }

    const disabledClasses = this.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed ring-gray-200' : '';

    return `${baseClasses} ${stateClasses} ${disabledClasses}`;
  }


  updateDisplayValue(): void {
    if (this.selectedDate) {
      this.displayValue = this.formatDate(this.selectedDate);
    } else {
      this.displayValue = '';
    }
  }

  // Métodos para navegación de calendario
  toggleCalendar(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.disabled) return;
    
    if (!this.isOpen) {
      this.isOpen = true;
      this.currentView = 'days';
      this.generateCalendar();
      this.calculateCalendarPosition();
      
      // Inicializar invisible
      this.overlayVisible = false;
      this.calendarVisible = false;
      
      // Mostrar con animación
      setTimeout(() => {
        this.overlayVisible = true;
        this.calendarVisible = true;
      }, 10);
    } else {
      this.closeCalendar();
    }
  }

  private calculateCalendarPosition(): void {
    const calendarWidth = 320; // w-80 = 320px
    const calendarHeight = 400;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Centrar horizontalmente
    this.calendarLeft = Math.max(0, (viewportWidth - calendarWidth) / 2);
    
    // Centrar verticalmente
    this.calendarTop = Math.max(0, (viewportHeight - calendarHeight) / 2);
  }

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', ['$event'])
  onWindowScrollOrResize(): void {
    if (this.isOpen) {
      this.calculateCalendarPosition();
    }
  }

  closeCalendar(): void {
    // Ocultar con animación
    this.overlayVisible = false;
    this.calendarVisible = false;
    
    // Cerrar después de la animación
    setTimeout(() => {
      this.isOpen = false;
      this.currentView = 'days';
    }, 300);
  }

  showMonthPicker(): void {
    this.currentView = 'months';
  }

  showYearPicker(): void {
    this.currentView = 'years';
    this.generateYearRange();
  }

  showDayPicker(): void {
    this.currentView = 'days';
    this.generateCalendar();
  }

  selectMonth(month: number): void {
    this.currentMonth = month;
    this.generateCalendar();
    this.showDayPicker();
  }

  selectYear(year: number): void {
    this.currentYear = year;
    this.generateCalendar();
    this.showDayPicker();
  }

  previousYearRange(): void {
    this.startYear -= 25;
    this.endYear -= 25;
    this.generateYearRange();
  }

  nextYearRange(): void {
    this.startYear += 25;
    this.endYear += 25;
    this.generateYearRange();
  }

  generateYearRange(): void {
    this.yearRange = [];
    for (let year = this.startYear; year <= this.endYear; year++) {
      this.yearRange.push(year);
    }
  }

  // Métodos de estilo para month y year picker
  getMonthClasses(month: number): string {
    const baseClasses = 'p-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100';
    
    if (month === this.currentMonth) {
      return `${baseClasses} bg-iebem-primary text-white hover:bg-iebem-dark`;
    }
    
    return `${baseClasses} text-gray-700`;
  }

  getYearClasses(year: number): string {
    const baseClasses = 'p-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100';
    
    if (year === this.currentYear) {
      return `${baseClasses} bg-iebem-primary text-white hover:bg-iebem-dark`;
    }
    
    return `${baseClasses} text-gray-700`;
  }

  // Métodos existentes del calendario
  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarDays = [];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      this.calendarDays.push({
        date: date,
        number: date.getDate(),
        isCurrentMonth: date.getMonth() === this.currentMonth,
        isToday: this.isToday(date),
        isSelected: this.isSelected(date)
      });
    }
  }

  selectDate(day: any): void {
    if (!day.isCurrentMonth) return;
    
    this.selectedDate = new Date(day.date);
    this.onChangeCallback(this.selectedDate);
    this.generateCalendar();
    this.updateDisplayValue();
    this.closeCalendar();
  }

  selectToday(): void {
    this.selectedDate = new Date();
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();
    this.onChangeCallback(this.selectedDate);
    this.generateCalendar();
    this.updateDisplayValue();
    this.closeCalendar();
  }

  clearDate(): void {
    this.selectedDate = null;
    this.displayValue = '';
    this.onChangeCallback(null);
    this.closeCalendar();
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  getMonthName(): string {
    return this.monthNames[this.currentMonth];
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isSelected(date: Date): boolean {
    if (!this.selectedDate) return false;
    return date.toDateString() === this.selectedDate.toDateString();
  }

  getDayClasses(day: any): string {
    const baseClasses = 'w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200';
    
    if (!day.isCurrentMonth) {
      return `${baseClasses} text-gray-300 cursor-not-allowed`;
    }
    
    if (day.isSelected) {
      return `${baseClasses} bg-iebem-primary text-white shadow-lg`;
    }
    
    if (day.isToday) {
      return `${baseClasses} bg-iebem-light text-iebem-primary border-2 border-iebem-primary`;
    }
    
    return `${baseClasses} text-gray-700 hover:bg-gray-100 cursor-pointer`;
  }

  // Métodos de ControlValueAccessor
  writeValue(value: any): void {
    this.selectedDate = value ? new Date(value) : null;
    if (this.selectedDate) {
      this.currentMonth = this.selectedDate.getMonth();
      this.currentYear = this.selectedDate.getFullYear();
    }
    this.generateCalendar();
    this.updateDisplayValue();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}