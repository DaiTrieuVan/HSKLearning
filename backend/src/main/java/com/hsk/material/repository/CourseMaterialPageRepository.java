package com.hsk.material.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hsk.material.domain.CourseMaterialPageEntity;

public interface CourseMaterialPageRepository extends JpaRepository<CourseMaterialPageEntity, Long> {

	List<CourseMaterialPageEntity> findByMaterial_IdOrderByPageNumberAsc(Long materialId);

	Optional<CourseMaterialPageEntity> findByMaterial_IdAndPageNumber(Long materialId, int pageNumber);

	void deleteByMaterial_Id(Long materialId);
}
