import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import {Controller} from "../../presentation/protocols/controller";
import {HttpRequest, HttpResponse} from "../../presentation/protocols/http";

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository
  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpResquest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpResquest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
