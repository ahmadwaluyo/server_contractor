import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ){}
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { project_name, project_address, end_date, saldo_project, owner_name } = createProjectDto;
    const selectedProject: Project = await this.projectRepository.findOne({
      where: {
        project_name,
      },
    });
    if (selectedProject) throw new NotFoundException(`Project ${project_name} is already exist !`);

    return this.projectRepository.save({ project_name, project_address, end_date, saldo_project, owner_name });
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['workers'] });
  }

  async findOne(id: number): Promise<Project> {
    const selectedProject: Project = await this.projectRepository.findOne({
      where: {
        id: id
      },
      relations: ['workers'],
    });
    if (!selectedProject) throw new NotFoundException(`there is no projects with ID ${id}`);
    return selectedProject;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<UpdateResult> {
    return this.projectRepository.update(id, updateProjectDto);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.projectRepository.delete(id);
  }
}
