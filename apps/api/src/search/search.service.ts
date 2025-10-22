import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class SearchService {
  private readonly client: Client;
  private readonly logger = new Logger(SearchService.name);

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'
    });
  }

  async indexCourse(course: { id: string; title: string; summary?: string; language: string }) {
    try {
      await this.client.index({
        index: 'courses',
        id: course.id,
        document: course
      });
    } catch (error) {
      this.logger.error('Error indexando curso', error as Error);
    }
  }

  async searchCourses(query: string) {
    const response = await this.client.search({
      index: 'courses',
      query: {
        multi_match: {
          query,
          fields: ['title^3', 'summary']
        }
      }
    });
    return response.hits.hits.map((hit) => ({ id: hit._id, ...(hit._source as object) }));
  }
}
