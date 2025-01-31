import { CreateOrganizationDto } from "../dtos/organization.dto";
import { APIError } from "../middlewares/error-handler";
import { OrganizationModel } from "../models/organization.model";

export class OrganizationService {
  constructor(private readonly organizationModel: typeof OrganizationModel) {}

  public async createOrganization(organizationDto: CreateOrganizationDto) {
    const existingOrganization = await this.organizationModel.find(
      organizationDto
    );
    if (existingOrganization) {
      throw new APIError("Organization Already Exists", 400);
    }
    const organization = await this.organizationModel.create(
      this.organizationModel
    );
    return {
      message: "Your organization has been registered successfully!",
      organization,
    };
  }

  public async fetchSingleOrganization(id: string) {
    const organization = await this.organizationModel
      .findById(id)
      .populate("owner")
      .populate("members");

    return organization;
  }

  public async fetchAllOrganizations() {
    // Pagination comes later
    const organizations = await this.organizationModel.find();
    return organizations;
  }
}
