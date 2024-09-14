'use client'

import styles from "../page.module.css";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppProvider";
import ProjectSelector from "../components/ProjectSelector";

export default function Projects() {

    const { notes } = useContext(AppContext);
    // const activeProjects = projects.filter(note => !project.isArchived && !project.isTrash);

    const activeProjects = ['', ''];

    const newProject = ({
        name: 'Project Name',
        description: '',
        id: '1',
        todoList: [],
        
    });

    const oldProject = ({
        name: 'Project Name',
        description: "Project Description",
        id: '2'
    });


    return (
        <main className={styles.content}>
            <ProjectSelector
                mode={'create'}
                project={newProject}
            />
            <div style={{
                height: '1rem'
            }} />
            {activeProjects.length === 0 ? (
                <h3>Projects you add appear here</h3>
            ) : (
                // Todo
                // activeNotes.map(note => (
                //     <ProjectSelector project={project} mode='read' key={project.id} />
                // ))
                <>
                    <ProjectSelector
                        mode={'read'}
                        project={oldProject}
                    />
                        <div style={{
                            height: '1rem'
                        }} />
                    <ProjectSelector
                        mode={'read'}
                        project={oldProject}
                    />
                        <div style={{
                            height: '1rem'
                        }} />
                    <ProjectSelector
                        mode={'read'}
                        project={oldProject}
                    />
                        <div style={{
                            height: '1rem'
                        }} />
                    <ProjectSelector
                        mode={'read'}
                        project={oldProject}
                    />   
                        <div style={{
                            height: '1rem'
                        }} />            
                    <ProjectSelector
                        mode={'read'}
                        project={oldProject}
                    />
                </>
            )}
        </main>
    );
}
