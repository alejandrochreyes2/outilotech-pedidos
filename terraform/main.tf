terraform {
  required_providers {
    oci = {
      source = "oracle/oci"
      version = "~> 5.0"
    }
  }
}

provider "oci" {
  region = var.home_region
}

data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

data "oci_core_images" "ubuntu" {
  compartment_id           = var.tenancy_ocid
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "22.04"
  shape                    = "VM.Standard.A1.Flex"
}

resource "oci_core_instance" "outiltech_vm" {
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  compartment_id      = var.tenancy_ocid
  shape               = "VM.Standard.A1.Flex"
  shape_config {
    ocpus         = 4
    memory_in_gbs = 24
  }

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.ubuntu.images[0].id
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data = base64encode(templatefile("${path.module}/user-data.sh", {}))
  }

  display_name = "outiltech-backend"
}

output "vm_public_ip" {
  value = oci_core_instance.outiltech_vm.public_ip
}
