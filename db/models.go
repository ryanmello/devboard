package db

import (
    "time"
    "github.com/lib/pq"
)

type User struct {
    Id               string         `gorm:"type:uuid;primaryKey" json:"id"`
    Email            string         `gorm:"uniqueIndex;not null" json:"email"`
    Username         string         `gorm:"uniqueIndex;not null" json:"username"`
    FirstName        *string        `json:"firstName"`
    LastName         *string        `json:"lastName"`
    Image            *string        `json:"image"`
    Headline         *string        `json:"headline"`
    Resume           *string        `json:"resume"`
    Role             string         `gorm:"default:user" json:"role"`
    GitHubUsername   *string        `json:"githubUsername"`
    LeetCodeUsername *string        `json:"leetcodeUsername"`
    LinkedInUsername *string        `json:"linkedinUsername"`
    Skills           pq.StringArray `gorm:"type:text[]" json:"skills" swaggertype:"array,string"`
    CreatedAt        time.Time      `json:"createdAt"`
    UpdatedAt        time.Time      `json:"updatedAt"`
    
    Projects   []Project    `gorm:"foreignKey:UserId" json:"projects,omitempty"`
    Education  []Education  `gorm:"foreignKey:UserId" json:"education,omitempty"`
    Experience []Experience `gorm:"foreignKey:UserId" json:"experience,omitempty"`
}

type Project struct {
    Id              string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
    UserId          string    `gorm:"type:uuid;not null" json:"userId"`
    Name            string    `gorm:"not null" json:"name"`
    GitHubURL       *string   `json:"githubUrl"`
    PrimaryLanguage *string   `json:"primaryLanguage"`
    Description     *string   `json:"description"`
    Image           *string   `json:"image"`
    URL             *string   `json:"url"`
    CreatedAt       time.Time `json:"createdAt"`
    UpdatedAt       time.Time `json:"updatedAt"`
}

type Education struct {
    Id              string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
    UserId          string    `gorm:"type:uuid;not null" json:"userId"`
    UniversityName  string    `gorm:"not null" json:"universityName"`
    UniversityImage *string   `json:"universityImage"`
    StartYear       string    `gorm:"not null" json:"startYear"`
    GraduationYear  string    `gorm:"not null" json:"graduationYear"`
    Major           string    `gorm:"not null" json:"major"`
    Minor           *string   `json:"minor"`
    GPA             *string   `json:"gpa"`
    CreatedAt       time.Time `json:"createdAt"`
    UpdatedAt       time.Time `json:"updatedAt"`
}

type Experience struct {
    Id             string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
    UserId         string    `gorm:"type:uuid;not null" json:"userId"`
    Company        string    `gorm:"not null" json:"company"`
    CompanyImage   *string   `json:"companyImage"`
    Title          string    `gorm:"not null" json:"title"`
    StartMonth     string    `gorm:"not null" json:"startMonth"`
    StartYear      string    `gorm:"not null" json:"startYear"`
    EndMonth       *string   `json:"endMonth"`
    EndYear        *string   `json:"endYear"`
    IsCurrent      bool      `gorm:"default:false" json:"isCurrent"`
    Location       *string   `json:"location"`
    EmploymentType *string   `json:"employmentType"`
    Description    *string   `json:"description"`
    CreatedAt      time.Time `json:"createdAt"`
    UpdatedAt      time.Time `json:"updatedAt"`
}
