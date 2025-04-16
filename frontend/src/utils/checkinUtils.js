/**
 * Calculate the completion percentage of a checkin
 * @param {Object} checkin - The checkin object
 * @returns {string} - The percentage as a string (e.g., "75%")
 */
export const getCompletionStatus = (checkin) => {
    if (!checkin) return "0%"
  
    const fields = [
      "project_manager",
      "business_manager",
      "engineering_leader_manager",
      "quality_leader",
      "plant_quality_leader",
      "industrial_engineering",
      "launch_manager_method",
      "maintenance",
      "purchasing",
      "logistics",
      "sales",
      "economic_financial_leader",
    ]
  
    const completedFields = fields.filter((field) => checkin[field]?.value === true).length
    const percentage = Math.round((completedFields / fields.length) * 100)
  
    return `${percentage}%`
  }
  
  /**
   * Format a date string to a readable format
   * @param {string} dateString - The date string to format
   * @returns {string} - The formatted date string
   */
  export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  