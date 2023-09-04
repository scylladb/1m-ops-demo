# Create Virtual Private Cloud
resource "aws_vpc" "custom_vpc" {
  cidr_block           = var.custom_vpc
  instance_tenancy     = var.instance_tenancy
  enable_dns_support   = true
  enable_dns_hostnames = true
}

# Create Public subnet
resource "aws_subnet" "public_subnet" {
  count                   = var.custom_vpc == "10.0.0.0/16" ? 3 : 0
  vpc_id                  = aws_vpc.custom_vpc.id
  availability_zone       = data.aws_availability_zones.azs.names[count.index]
  cidr_block              = element(cidrsubnets(var.custom_vpc, 8, 4, 4), count.index)
  map_public_ip_on_launch = true
  tags = {
    "Name" = "${var.custom_name}-Public-Subnet-${count.index}"
  }
}

# Create Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.custom_vpc.id

  tags = {
    "Name" = "${var.custom_name}-Internet-Gateway"
  }
}

# Create Public Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.custom_vpc.id

  tags = {
    "Name" = "${var.custom_name}-Public-RouteTable"
  }
}

# Create Public Route
resource "aws_route" "public_route" {
  route_table_id         = aws_route_table.public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

# Create Public Route Table Association
resource "aws_route_table_association" "public_rt_association" {
  count          = length(aws_subnet.public_subnet) == 3 ? 3 : 0
  route_table_id = aws_route_table.public_rt.id
  subnet_id      = element(aws_subnet.public_subnet.*.id, count.index)
}

# Accepter's side of the connection
resource "aws_vpc_peering_connection_accepter" "current" {
  vpc_peering_connection_id = scylladbcloud_vpc_peering.scylladbcloud.connection_id
  auto_accept               = true

  tags = {
    Side = "Accepter"
  }
}

# Create SC Route:
resource "aws_route" "scylla-cloud" {
  route_table_id            = aws_route_table.public_rt.id
  destination_cidr_block    = "172.31.0.0/16"
  vpc_peering_connection_id = scylladbcloud_vpc_peering.scylladbcloud.connection_id
  #  depends_on                = [aws_route_table.testing]
}