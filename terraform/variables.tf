variable "home_region" {
  description = "Home Region de Oracle Cloud (ej. us-ashburn-1)"
  type = string
}
variable "tenancy_ocid" {
  description = "OCID de la tenencia"
  type = string
}
variable "ssh_public_key" {
  description = "Clave pública SSH"
  type = string
}
