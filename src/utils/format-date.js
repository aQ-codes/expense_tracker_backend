export default class FormatDate{
  /**
   * Formats an ISO date string to DD/MM/YYYY format.
   * @param {string} isoDate - The ISO date string to format.
   * @returns {string} - The formatted date in DD/MM/YYYY format.
   */
  formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Formats an ISO date string to "Day Month Year" format (e.g., "7 Aug 2024").
   * @param {string} isoDate - The ISO date string to format.
   * @returns {string} - The formatted date in "Day Month Year" format.
   */
  formatDateForDisplay(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  /**
   * Formats an ISO date string to "Today", "Yesterday", or "Day Month Year" format.
   * @param {string} isoDate - The ISO date string to format.
   * @returns {string} - The formatted date with relative terms.
   */
  formatDateRelative(isoDate) {
    const date = new Date(isoDate);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return this.formatDateForDisplay(isoDate);
  }

  /**
   * Formats an ISO date string to month and day format (e.g., "Aug 7").
   * @param {string} isoDate - The ISO date string to format.
   * @returns {string} - The formatted date in "Month Day" format.
   */
  weekDateFormat(isoDate) {
    const date = new Date(isoDate);
    const options = { month: 'short', day: 'numeric' }; 
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Formats an ISO date string to YYYY-MM-DD format for form inputs.
   * @param {string} isoDate - The ISO date string to format.
   * @returns {string} - The formatted date in YYYY-MM-DD format.
   */
  formatDateForInput(isoDate) {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Gets the current date in YYYY-MM-DD format.
   * @returns {string} - The current date in YYYY-MM-DD format.
   */
  getCurrentDate() {
    const today = new Date();
    return this.formatDateForInput(today);
  }

  /**
   * Checks if a date is in the future.
   * @param {string} isoDate - The ISO date string to check.
   * @returns {boolean} - True if the date is in the future.
   */
  isFutureDate(isoDate) {
    const date = new Date(isoDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  }
}