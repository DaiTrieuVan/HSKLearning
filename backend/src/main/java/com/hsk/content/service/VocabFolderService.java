package com.hsk.content.service;

import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.VocabFolderEntity;
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.dto.CreateVocabFolderRequest;
import com.hsk.content.dto.VocabFolderDto;
import com.hsk.content.repository.VocabFolderRepository;
import com.hsk.content.repository.VocabSetRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VocabFolderService {

	private final VocabFolderRepository vocabFolderRepository;
	private final VocabSetRepository vocabSetRepository;

	public VocabFolderService(
			VocabFolderRepository vocabFolderRepository,
			VocabSetRepository vocabSetRepository
	) {
		this.vocabFolderRepository = vocabFolderRepository;
		this.vocabSetRepository = vocabSetRepository;
	}

	@Transactional(readOnly = true)
	public List<VocabFolderDto> getMyFolders(Long userId) {
		List<VocabFolderEntity> folders = vocabFolderRepository.findByUserIdOrderByCreatedAtDesc(userId);
		return folders.stream()
				.map(f -> {
					int setCount = (int) vocabSetRepository.countByFolderId(f.getId());
					return VocabFolderDto.fromEntity(f, setCount);
				})
				.toList();
	}

	@Transactional
	public VocabFolderDto createFolder(Long userId, CreateVocabFolderRequest request) {
		String title = request.title().trim();
		String description = request.description() != null ? request.description().trim() : null;
		String color = request.color() != null && !request.color().isBlank() ? request.color().trim() : "#f59e0b";

		VocabFolderEntity entity = new VocabFolderEntity(userId, title, description, color);
		VocabFolderEntity saved = vocabFolderRepository.save(entity);
		return VocabFolderDto.fromEntity(saved, 0);
	}

	@Transactional
	public VocabFolderDto updateFolder(Long userId, Long folderId, CreateVocabFolderRequest request) {
		VocabFolderEntity folder = vocabFolderRepository.findByIdAndUserId(folderId, userId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy thư mục"));

		folder.setTitle(request.title().trim());
		folder.setDescription(request.description() != null ? request.description().trim() : null);
		if (request.color() != null && !request.color().isBlank()) {
			folder.setColor(request.color().trim());
		}

		VocabFolderEntity updated = vocabFolderRepository.save(folder);
		int setCount = (int) vocabSetRepository.countByFolderId(folderId);
		return VocabFolderDto.fromEntity(updated, setCount);
	}

	@Transactional
	public void deleteFolder(Long userId, Long folderId) {
		VocabFolderEntity folder = vocabFolderRepository.findByIdAndUserId(folderId, userId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy thư mục"));

		// Chuyển các bộ từ trong folder ra thư mục gốc để không làm mất bộ từ của người dùng
		List<VocabSetEntity> childSets = vocabSetRepository.findByFolderId(folderId);
		for (VocabSetEntity set : childSets) {
			set.setFolderId(null);
		}
		vocabSetRepository.saveAll(childSets);

		vocabFolderRepository.delete(folder);
	}
}
