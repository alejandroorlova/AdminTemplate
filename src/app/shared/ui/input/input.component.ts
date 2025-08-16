import { Component, Input, forwardRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' = 'text';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() icon = '';
  @Input() suffixIcon = '';
  @Input() id = '';
  @Input() dateFormat: 'DD/MM/AAAA' | 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' = 'DD/MM/AAAA';

  @ViewChild('inputElement') inputElement!: ElementRef;

  value = '';
  displayValue = '';
  isFocused = false;
  hasValidDate = false;
  
  // Variable para controlar la visibilidad de la contraseña
  showPassword = false;
  
  // Variables específicas para calendar
  isCalendarOpen = false;
  currentView: 'days' | 'months' | 'years' = 'days';
  selectedDate: Date | null = null;
  
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

  private onChange = (value: string) => { };
  private onTouched = () => { };

  ngOnInit(): void {
    if (this.type === 'date') {
      this.generateCalendar();
      this.generateYearRange();
    }
  }

  getPlaceholderText(): string {
    if (this.type === 'date') {
      return this.placeholder || this.dateFormat;
    }
    return this.placeholder;
  }

  getInputType(): string {
    if (this.type === 'date') {
      // Usar text cuando está vacío o escribiendo, date cuando hay valor válido
      return this.hasValidDate && !this.isFocused ? 'date' : 'text';
    }
    
    // Para el tipo password, alternar entre password y text según showPassword
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    
    return this.type;
  }

  getDisplayValue(): string {
    if (this.type === 'date') {
      if (this.hasValidDate && !this.isFocused) {
        // Mostrar en formato ISO para el input type="date"
        return this.value;
      } else {
        // Mostrar lo que está escribiendo el usuario
        return this.displayValue;
      }
    }
    return this.value;
  }

  get inputClasses(): string {
    const baseClasses = 'block w-full rounded-xl !border-0 shadow-sm ring-1 ring-inset transition-all duration-200 focus:ring-2 focus:ring-inset focus:outline-none text-gray-900 placeholder:text-gray-400';
    
    // Para type="date", no usar padding izquierdo para ícono
    const iconPadding = (this.icon && this.type !== 'date') ? '!pl-10' : '!pl-4';
    
    // Para type="date" o "password", solo mostrar el botón específico
    const suffixPadding = (this.suffixIcon && this.type !== 'date' && this.type !== 'password') || this.type === 'date' || this.type === 'password' ? '!pr-10' : '!pr-4';
    
    const verticalPadding = '!py-3';
    const padding = `${verticalPadding} ${iconPadding} ${suffixPadding}`;
    
    // Ocultar iconos nativos del navegador para input date
    const dateSpecificClasses = this.type === 'date' ? 'date-input-no-icon' : '';
    
    let stateClasses = '';
    if (this.error) {
      stateClasses = 'ring-red-300 focus:ring-red-500 bg-red-50';
    } else if (this.isFocused || this.isCalendarOpen) {
      stateClasses = 'ring-iebem-primary focus:ring-iebem-primary bg-white';
    } else {
      stateClasses = 'ring-gray-300 focus:ring-iebem-primary bg-white hover:ring-gray-400';
    }

    const disabledClasses = this.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed ring-gray-200' : '';

    return `${baseClasses} ${padding} ${stateClasses} ${disabledClasses} ${dateSpecificClasses}`;
  }

  // Posición del calendario
  getCalendarPosition() {
    return {
      'left': '0',
      'right': '0'
    };
  }

  // Cerrar calendario al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isCalendarOpen && this.type === 'date') {
      const target = event.target as HTMLElement;
      const calendarElement = target.closest('.absolute.z-50');
      const buttonElement = target.closest('button');
      
      if (!calendarElement && !buttonElement) {
        this.closeCalendar();
      }
    }
  }

  // Método para toggle de visibilidad de contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Métodos para input normal
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const inputValue = target.value;
    
    if (this.type === 'date') {
      this.displayValue = inputValue;
      
      // Solo intentar parsear si parece una fecha completa
      if (this.isCompleteDateInput(inputValue)) {
        const parsedDate = this.parseUserDate(inputValue);
        if (parsedDate) {
          this.value = parsedDate.toISOString().split('T')[0];
          this.selectedDate = parsedDate;
          this.hasValidDate = true;
          this.currentMonth = parsedDate.getMonth();
          this.currentYear = parsedDate.getFullYear();
          this.generateCalendar();
          this.onChange(this.value);
        } else {
          this.hasValidDate = false;
        }
      } else {
        // Mientras escribe, mantener hasValidDate como false
        this.hasValidDate = false;
        if (!inputValue) {
          this.value = '';
          this.selectedDate = null;
          this.onChange('');
        }
      }
    } else {
      this.value = inputValue;
      this.displayValue = inputValue;
      this.onChange(inputValue);
    }
  }

  isCompleteDateInput(input: string): boolean {
    if (!input) return false;
    
    // Verificar si tiene un formato que parece completo
    const patterns = [
      /^\d{1,2}\/\d{1,2}\/\d{4}$/,    // DD/MM/YYYY
      /^\d{1,2}\/\d{1,2}\/\d{2}$/,    // DD/MM/YY
      /^\d{1,2}-\d{1,2}-\d{4}$/,      // DD-MM-YYYY
      /^\d{1,2}-\d{1,2}-\d{2}$/,      // DD-MM-YY
      /^\d{4}\/\d{1,2}\/\d{1,2}$/,    // YYYY/MM/DD
      /^\d{4}-\d{1,2}-\d{1,2}$/,      // YYYY-MM-DD
    ];
    
    return patterns.some(pattern => pattern.test(input.trim()));
  }

  onBlur(): void {
    this.isFocused = false;
    
    if (this.type === 'date') {
      // Al salir del foco, intentar parsear lo que hay
      if (this.displayValue && !this.hasValidDate) {
        const parsedDate = this.parseUserDate(this.displayValue);
        if (parsedDate) {
          this.setDateValue(parsedDate);
        }
      }
      
      // Si hay una fecha válida, cambiar a type="date"
      if (this.hasValidDate && this.selectedDate) {
        setTimeout(() => {
          if (this.inputElement) {
            this.inputElement.nativeElement.value = this.value;
          }
        }, 0);
      }
    }
    
    this.onTouched();
  }

  onFocus(): void {
    this.isFocused = true;
    
    if (this.type === 'date' && this.hasValidDate && this.selectedDate) {
      // Al enfocar, mostrar en formato legible para el usuario
      this.displayValue = this.formatUserDate(this.selectedDate);
      setTimeout(() => {
        if (this.inputElement) {
          this.inputElement.nativeElement.value = this.displayValue;
        }
      }, 0);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.type === 'date') {
      // Permitir teclas de control y navegación
      const allowedKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
      ];
      
      const isNumber = event.key >= '0' && event.key <= '9';
      const isAllowedSeparator = event.key === '/' || event.key === '-';
      const isModifierKey = event.ctrlKey || event.metaKey || event.altKey;
      
      // Permitir solo números, separadores válidos, teclas de control y modificadores
      if (!isNumber && !isAllowedSeparator && !allowedKeys.includes(event.key) && !isModifierKey) {
        event.preventDefault();
        return;
      }
      
      // Si presiona Enter, intentar parsear la fecha
      if (event.key === 'Enter') {
        if (this.displayValue && !this.hasValidDate) {
          const parsedDate = this.parseUserDate(this.displayValue);
          if (parsedDate) {
            this.setDateValue(parsedDate);
          }
        }
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    if (this.type === 'date') {
      event.preventDefault();
      const pastedText = event.clipboardData?.getData('text') || '';
      
      // Intentar parsear la fecha pegada
      const parsedDate = this.parseUserDate(pastedText);
      if (parsedDate) {
        this.setDateValue(parsedDate);
      }
    }
  }

  validateAndFormatDate(): void {
    if (!this.inputElement) return;
    
    const inputValue = this.inputElement.nativeElement.value;
    
    // Si está vacío, no hacer nada
    if (!inputValue) return;
    
    // Intentar parsear lo que el usuario escribió
    const parsedDate = this.parseUserDate(inputValue);
    
    if (parsedDate) {
      // Si es una fecha válida, formatearla correctamente
      this.setDateValue(parsedDate);
    }
  }

  parseUserDate(dateString: string): Date | null {
    if (!dateString) return null;
    
    // Limpiar la cadena
    const cleaned = dateString.trim().replace(/\s+/g, '');
    
    let day, month, year;
    
    // Patrones basados en el formato configurado
    if (this.dateFormat === 'MM/DD/YYYY') {
      // Formato americano MM/DD/YYYY
      const mmddyyyyPattern = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
      const mmddyyPattern = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/;
      
      if (mmddyyyyPattern.test(cleaned)) {
        const match = cleaned.match(mmddyyyyPattern);
        month = parseInt(match![1], 10) - 1; // Mes primero
        day = parseInt(match![2], 10);
        year = parseInt(match![3], 10);
      } else if (mmddyyPattern.test(cleaned)) {
        const match = cleaned.match(mmddyyPattern);
        month = parseInt(match![1], 10) - 1;
        day = parseInt(match![2], 10);
        year = parseInt(match![3], 10);
        year += year < 50 ? 2000 : 1900;
      } else {
        return this.tryParseAsISO(dateString);
      }
    } else if (this.dateFormat === 'YYYY-MM-DD') {
      // Formato ISO YYYY-MM-DD
      const yyyymmddPattern = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/;
      
      if (yyyymmddPattern.test(cleaned)) {
        const match = cleaned.match(yyyymmddPattern);
        year = parseInt(match![1], 10);
        month = parseInt(match![2], 10) - 1;
        day = parseInt(match![3], 10);
      } else {
        return this.tryParseAsISO(dateString);
      }
    } else {
      // Formato por defecto DD/MM/YYYY o DD/MM/AAAA
      const ddmmyyyyPattern = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
      const ddmmyyPattern = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/;
      
      if (ddmmyyyyPattern.test(cleaned)) {
        const match = cleaned.match(ddmmyyyyPattern);
        day = parseInt(match![1], 10);
        month = parseInt(match![2], 10) - 1; // Los meses en JS son 0-indexados
        year = parseInt(match![3], 10);
      } else if (ddmmyyPattern.test(cleaned)) {
        const match = cleaned.match(ddmmyyPattern);
        day = parseInt(match![1], 10);
        month = parseInt(match![2], 10) - 1;
        year = parseInt(match![3], 10);
        // Convertir año de 2 dígitos a 4 dígitos
        year += year < 50 ? 2000 : 1900;
      } else {
        return this.tryParseAsISO(dateString);
      }
    }
    
    // Crear la fecha y validarla
    const date = new Date(year, month, day);
    
    // Verificar que la fecha sea válida (no como 31/02/2024)
    if (date.getFullYear() === year && 
        date.getMonth() === month && 
        date.getDate() === day) {
      return date;
    }
    
    return null;
  }

  private tryParseAsISO(dateString: string): Date | null {
    // Fallback: intentar que sea una fecha ISO válida
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date : null;
  }

  formatUserDate(date: Date): string {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    
    switch (this.dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default: // DD/MM/YYYY o DD/MM/AAAA
        return `${day}/${month}/${year}`;
    }
  }

  setDateValue(date: Date): void {
    // Formatear para el input type="date" (YYYY-MM-DD)
    this.value = date.toISOString().split('T')[0];
    this.selectedDate = date;
    this.hasValidDate = true;
    this.displayValue = this.formatUserDate(date);
    this.currentMonth = date.getMonth();
    this.currentYear = date.getFullYear();
    
    this.onChange(this.value);
    this.generateCalendar();
  }

  syncWithCalendar(): void {
    if (this.value && this.type === 'date') {
      const date = new Date(this.value);
      if (!isNaN(date.getTime())) {
        this.selectedDate = date;
        this.hasValidDate = true;
        this.displayValue = this.formatUserDate(date);
        this.currentMonth = date.getMonth();
        this.currentYear = date.getFullYear();
        this.generateCalendar();
      }
    } else {
      this.selectedDate = null;
      this.hasValidDate = false;
      this.displayValue = '';
    }
  }

  // Métodos del calendario
  toggleCalendar(event: Event): void {
    event.stopPropagation();
    if (this.disabled) return;
    
    this.isCalendarOpen = !this.isCalendarOpen;
    this.currentView = 'days';
    
    if (this.isCalendarOpen) {
      this.syncWithCalendar();
      this.generateCalendar();
    }
  }

  closeCalendar(): void {
    this.isCalendarOpen = false;
    this.currentView = 'days';
  }

  showMonthPicker(): void { this.currentView = 'months'; }
  showYearPicker(): void { this.currentView = 'years'; this.generateYearRange(); }
  showDayPicker(): void { this.currentView = 'days'; this.generateCalendar(); }

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

  selectDate(day: any): void {
    if (!day.isCurrentMonth) return;
    
    this.selectedDate = new Date(day.date);
    // Formato para input type="date": YYYY-MM-DD
    this.value = this.selectedDate.toISOString().split('T')[0];
    this.onChange(this.value);
    this.generateCalendar();
    this.closeCalendar();
    
    // Actualizar el input
    if (this.inputElement) {
      this.inputElement.nativeElement.value = this.value;
    }
  }

  selectToday(): void {
    this.selectedDate = new Date();
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();
    this.value = this.selectedDate.toISOString().split('T')[0];
    this.onChange(this.value);
    this.generateCalendar();
    this.closeCalendar();
    
    // Actualizar el input
    if (this.inputElement) {
      this.inputElement.nativeElement.value = this.value;
    }
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

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
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

  generateYearRange(): void {
    this.yearRange = [];
    for (let year = this.startYear; year <= this.endYear; year++) {
      this.yearRange.push(year);
    }
  }

  getMonthName(): string { return this.monthNames[this.currentMonth]; }

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

  writeValue(value: string): void {
    this.value = value || '';
    
    if (this.type === 'date' && this.value) {
      this.syncWithCalendar();
    } else if (this.type === 'date') {
      this.hasValidDate = false;
      this.displayValue = '';
      this.selectedDate = null;
    } else {
      this.displayValue = this.value;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}