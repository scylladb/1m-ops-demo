locals {
  my_ip = "89.134.0.15/32" # Replace YOUR_IP_ADDRESS with your actual IP address

  ingress_rules = [{
    name        = "HTTPS"
    port        = 443
    description = "Ingress rules for port 443"
    },
    {
      name        = "Monitoring"
      port        = 3000
      description = "Ingress rules for port 3000"
    },
    {
      name        = "HTTP"
      port        = 80
      description = "Ingress rules for port 80"
    },
    {
      name        = "SSH"
      port        = 22
      description = "Ingress rules for port 22"
    },
    {
      name        = "CQL"
      port        = 9042
      description = "Ingress rules for ScyllaDB"

    },
    {
      name = "SSL CQL"
      port = 9142

    },
    {
      name        = "rpc"
      port        = 7000
      description = "Ingress rules for ScyllaDB"

    },
    {
      name        = "RPC SSL"
      port        = 7001
      description = "Ingress rules for ScyllaDB"

    },
    {
      name        = "JMX"
      port        = 7199
      description = "Ingress rules for ScyllaDB"

    },
    {
      name        = "REST"
      port        = 10000
      description = "Ingress rules for ScyllaDB"

    },
    {
      name        = "Prometheus"
      port        = 9180
      description = "Ingress rules for ScyllaDB"

    },
    {
      name        = "Node exp"
      port        = 9100
      description = "Ingress rules for ScyllaDB"
    },
    {
      name        = "Thirft"
      port        = 9160
      description = "Ingress rules for ScyllaDB"
    },
    {
      name        = "shard-aware"
      port        = 19042
      description = "Ingress rules for ScyllaDB"
  }]

}

resource "aws_security_group" "sg" {
  name        = "${var.custom_name}-sg"
  description = "Allow TLS inbound traffic"
  vpc_id      = aws_vpc.custom_vpc.id
  egress = [
    {
      description      = "for all outgoing traffics"
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = ["::/0"]
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    }
  ]

  dynamic "ingress" {
    for_each = local.ingress_rules

    content {
      # description = ingress.value.description
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  ingress {
    description = "Allow access to port 3000 from my IP"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = [local.my_ip]
  }

  tags = {
    Name      = "${var.custom_name}-SG"
    "Project" = "${var.custom_name}"
    "Type"    = "SG"
  }

}
