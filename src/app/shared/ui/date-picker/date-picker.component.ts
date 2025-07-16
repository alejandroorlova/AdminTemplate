import { Component, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('dateInput') dateInput!: ElementRef;

  selectedDate: Date | null = null;
  isOpen = false;
  allowTyping = false;
  displayValue = '';
  currentView: 'days' | 'months' | 'years' = 'days';
  
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

  get triggerClasses(): string {
    const baseClasses = 'relative w-full cursor-pointer rounded-xl border-0 py-3 px-4 pr-4 shadow-sm ring-1 ring-inset transition-all duration-200 focus:ring-2 focus:ring-inset bg-white flex items-center justify-between';
    
    let stateClasses = '';
    if (this.error) {
      stateClasses = 'ring-red-300 hover:ring-red-400';
    } else if (this.isOpen || this.allowTyping) {
      stateClasses = 'ring-iebem-primary ring-2';
    } else {
      stateClasses = 'ring-gray-300 hover:ring-gray-400';
    }

    const disabledClasses = this.disabled ? 'bg-gray-100 cursor-not-allowed ring-gray-200' : 'hover:shadow-md';

    return `${baseClasses} ${stateClasses} ${disabledClasses}`;
  }

  // Métodos para el modo de escritura
  toggleTypingMode(event: Event): void {
    event.stopPropagation();
    this.allowTyping = !this.allowTyping;
    
    if (this.allowTyping) {
      this.isOpen = false;
      setTimeout(() => {
        this.dateInput?.nativeElement?.focus();
      }, 100);
    }
  }

  onInputChange(event: any): void {
    this.displayValue = event.target.value;
  }

  onInputBlur(): void {
    this.parseAndSetDate();
  }

  onInputFocus(): void {
    this.onTouchedCallback();
  }

  parseAndSetDate(): void {
    if (!this.displayValue.trim()) {
      this.selectedDate = null;
      this.onChangeCallback(null);
      return;
    }

    const date = this.parseDate(this.displayValue);
    if (date && this.isValidDate(date)) {
      this.selectedDate = date;
      this.currentMonth = date.getMonth();
      this.currentYear = date.getFullYear();
      this.onChangeCallback(date);
      this.generateCalendar();
      this.updateDisplayValue();
    } else {
      this.updateDisplayValue();
    }
  }

  parseDate(dateString: string): Date | null {
    // Limpiar y normalizar la entrada
    const cleaned = dateString.trim().replace(/\s+/g, '');
    
    // Patrones para diferentes formatos
    const patterns = [
      /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,  // DD/MM/YYYY o DD-MM-YYYY
      /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/,  // DD/MM/YY o DD-MM-YY
    ];

    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // Los meses en JS son 0-indexados
        let year = parseInt(match[3], 10);
        
        // Convertir año de 2 dígitos a 4 dígitos
        if (year < 100) {
          year += year < 50 ? 2000 : 1900;
        }
        
        const date = new Date(year, month, day);
        
        // Verificar que la fecha sea válida
        if (date.getFullYear() === year && 
            date.getMonth() === month && 
            date.getDate() === day) {
          return date;
        }
      }
    }
    
    return null;
  }

  isValidDate(date: Date): boolean {
    if (this.minDate && date < this.minDate) return false;
    if (this.maxDate && date > this.maxDate) return false;
    return true;
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
    
    this.isOpen = !this.isOpen;
    this.currentView = 'days';
    
    if (this.isOpen) {
      this.generateCalendar();
    }
  }

  closeCalendar(): void {
    this.isOpen = false;
    this.currentView = 'days';
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

  clearDate(event: Event): void {
    event.stopPropagation();
    this.selectedDate = null;
    this.displayValue = '';
    this.onChangeCallback(null);
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