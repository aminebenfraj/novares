import { apiRequest } from "../api"

const BASE_URL = "api/Supp"

// Helper function to format validation data
const formatValidationData = (data) => {
  // Deep clone the data to avoid modifying the original
  const formattedData = JSON.parse(JSON.stringify(data))

  // Process each field that might contain validation details
  Object.keys(formattedData).forEach((field) => {
    if (formattedData[field]?.details) {
      // Convert boolean ok_nok to string if needed
      if (typeof formattedData[field].details.ok_nok === "boolean") {
        formattedData[field].details.ok_nok = formattedData[field].details.ok_nok ? "OK" : "NOK"
      }

      // Ensure all fields have default values
      formattedData[field].details = {
        tko: formattedData[field].details.tko || false,
        ot: formattedData[field].details.ot || false,
        ot_op: formattedData[field].details.ot_op || false,
        is: formattedData[field].details.is || false,
        sop: formattedData[field].details.sop || false,
        ok_nok: formattedData[field].details.ok_nok || "",
        who: formattedData[field].details.who || "",
        when: formattedData[field].details.when || "",
        validation_check: formattedData[field].details.validation_check || false,
        comment: formattedData[field].details.comment || "",
      }
    }
  })

  return formattedData
}

// ✅ Get all Supps
export const getAllSupps = () => {
  return apiRequest("GET", BASE_URL)
}

// ✅ Get a single Supp by ID
export const getSuppById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`)
}

// ✅ Create a new Supp
export const createSupp = (data) => {
  const formattedData = formatValidationData(data)
  return apiRequest("POST", BASE_URL, formattedData)
}

// ✅ Update an existing Supp
export const updateSupp = (id, data) => {
  const formattedData = formatValidationData(data)
  return apiRequest("PUT", `${BASE_URL}/${id}`, formattedData)
}

// ✅ Delete a Supp
export const deleteSupp = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`)
}

