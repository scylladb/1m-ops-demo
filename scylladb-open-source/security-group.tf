locals {
  ingress_rules = [{
    name        = "HTTPS"
    port        = 443
    description = "Ingress rules for port 443"
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
  name        = var.custom_name
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
  tags = {
    Name = "AWS security group dynamic block"
  }

}
