import { Request } from "express";

enum organizationAccessLevel {
  owner = "owner",
  member = "member",
}

//  Will finish this later
export const withOrganizationAccessLevel = (
  req: Request,
  accessLevel: organizationAccessLevel
) => {};

export const isOrganizationMember = () => {};
