import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { assert } from "console";
import { COURSES } from "../../../../server/db-data";

describe("CoursesService", () => {

  let coursesService: CoursesService,
      httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CoursesService
      ]
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should retrieve all courses', () => {
    coursesService.findAllCourses().subscribe(courses => {
      expect(courses).toBeTruthy('No courses returned');
      expect(courses.length).toBe(12, 'Incorrect number of courses');
      const course = courses.find(course => course.id === 12);
      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');
    req.flush({
      payload: Object.values(COURSES)
    });
  });

  it('should retrieve one course', () => {
    coursesService.findCourseById(12).subscribe(course => {
      expect(course).toBeTruthy('No course found with ID 12');
      expect(course.id).toBe(12);
    });

    // Setup the fake request object
    const req = httpTestingController.expectOne('/api/courses/12');
    // Expect the method to match
    expect(req.request.method).toEqual('GET');
    // Manually send the data for the subscribe function
    req.flush(COURSES[12]);
  });

  afterEach(() => {
    // Check that no unintended http requests are fired
    httpTestingController.verify();
  });

});