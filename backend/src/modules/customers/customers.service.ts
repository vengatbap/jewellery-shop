import { CustomerRepository } from "./customers.repository"

export class CustomerService {

  static async create(data: any) {

    return await CustomerRepository.create(data)

  }

}