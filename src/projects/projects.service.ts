import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ResponseStatus from 'src/middleware/responses';
import { Repository, UpdateResult } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) { }
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const { project_name, project_address, end_date, saldo_project, owner_name } = createProjectDto;
      const selectedProject: Project = await this.projectRepository.findOne({
        where: {
          project_name,
        },
      });
      if (selectedProject) throw new NotFoundException(`Project ${project_name} is already exist !`);

      return this.projectRepository.save({ project_name, project_address, end_date, saldo_project, owner_name });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<Project[]> {
    try {
      const foundData = await this.projectRepository.find({ relations: ['workers', 'payrolls', 'absences'] });
      foundData.forEach((el) => {
        el.workers.forEach((e) => {
          delete e.password;
        });
      });
      const payload = {
        statusCode: 200,
        message: 'OK',
        data: foundData
      }
      return ResponseStatus(payload.statusCode, payload.message, payload.data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number): Promise<Project> {
    try {
      const selectedProject: Project = await this.projectRepository.findOne({
        where: {
          id: id
        },
        relations: ['workers', 'payrolls'],
      });
      if (!selectedProject) throw new NotFoundException(`there is no projects with ID ${id}`);
      selectedProject.workers.forEach((el) => {
        delete el.password;
      });
      return selectedProject;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<UpdateResult> {
    try {
      return this.projectRepository.update(id, updateProjectDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      await this.findOne(id);
      await this.projectRepository.delete(id);
      const payload = {
        statusCode: 200,
        message: 'Project successfully deleted',
      }
      return payload;
    } catch (error) {
      throw new Error(error);
    }
  }
}
